---
question: Why can't I write a spec that both takes a callback and returns a promise (or is an async function)? What should I do instead?
---

Jasmine needs to know when each asynchronous spec is done so that it can move
on to the next one at the right time. If a spec takes a `done` callback, that
means "I'm done when I call the callback". If a spec returns a promise, either
explicitly or by using the `async` keyword, it means "I'm done when the
returned promise is resolved or rejected". Those two things can't both be
true, and Jasmine has no way of resolving the ambiguity. Future readers are
also likely to have trouble understanding the intent of the spec.

Usually people who ask this question are dealing with one of two situations.
Either they're using `async` just to be able to `await` and not to signal
completion to Jasmine, or they're trying to test code that mixes multiple 
async styles.

### The first scenario: when a spec is `async` just so it can `await`

```javascript
// WARNING: does not work correctly
it('does something', async function(done) {
  const something = await doSomethingAsync();
  doSomethingElseAsync(something, function(result) {
    expect(result).toBe(/*...*/);
    done();
  });
});
```

In this case the intent is for the spec to be done when the callback is called,
and the promise that's implicitly returned from the spec is meaningless. The
best fix is to change the callback-based function so that it returns a promise
and then `await` the promise:

```javascript
it('does something', async function(/* Note: no done param */) {
  const something = await doSomethingAsync();
  const result = await new Promise(function(resolve, reject) {
    doSomethingElseAsync(something, function(r) {
      resolve(r);
    });
  });
  expect(result).toBe(/*...*/);
});
```

If you want to stick with callbacks, you can wrap the `async` function in
an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE):

```javascript
it('does something', function(done) {
  (async function () {
    const something = await doSomethingAsync();
    doSomethingElseAsync(something, function(result) {
      expect(result).toBe(/*...*/);
      done();
    });
  })();
});
```

or replace `await` with `then`:
```javascript
it('does something', function(done) {
  doSomethingAsync().then(function(something) {
    doSomethingElseAsync(something, function(result) {
      expect(result).toBe(170);
      done();
    });
  });
});
```



### The second scenario: Code that signals completion in multiple ways

```javascript
// in DataLoader.js
class DataLoader {
  constructor(fetch) {
    // ...
  }

  subscribe(subscriber) {
    // ...
  }

  async load() {
    // ...
  }
}

// in DataLoaderSpec.js
// WARNING: does not work correctly
it('provides the fetched data to observers', async function(done) {
  const fetch = function() {
    return Promise.resolve(/*...*/);
  };
  const subscriber = function(result) {
    expect(result).toEqual(/*...*/);
    done();
  };
  const subject = new DataLoader(fetch);

  subject.subscribe(subscriber);
  await subject.load(/*...*/);
});
```

Just like in the first scenario, the problem with this spec is that it signals
completion in two different ways: by settling (resolving or rejecting) the
implicitly returned promise, and by calling the `done` callback. This mirrors
a potential design problem with the `DataLoader` class. Usually people write
specs like this because the code under test can't be relied upon to signal
completion in a consistent way. The order in which subscribers are called and
the returned promise is settled might be unpredictable. Or worse, `DataLoader`
might only use the returned promise to signal failure, leaving it pending in
the success case. It's difficult to write a reliable spec for code that has
that problem.

The fix is to change the code under test to always signal completion in a
consistent way. In this case that means making sure that the last thing
`DataLoader` does, in both success and failure cases, is resolve or reject the
returned promise. Then it can be reliably tested like this:

```javascript
it('provides the fetched data to observers', async function(/* Note: no done param */) {
  const fetch = function() {
    return Promise.resolve(/*...*/);
  };
  const subscriber = jasmine.createSpy('subscriber');
  const subject = new DataLoader(fetch);

  subject.subscribe(subscriber);
  // Await the returned promise. This will fail the spec if the promise
  // is rejected or isn't resolved before the spec timeout.
  await subject.load(/*...*/);
  // The subscriber should have been called by now. If not,
  // that's a bug in DataLoader, and we want the following to fail.
  expect(subscriber).toHaveBeenCalledWith(/*...*/);
});
```

See also [how to assert the arguments passed to an async callback that happens before the code under test is finished](#callback-assertions).
