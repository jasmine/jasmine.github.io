---
layout: article
title: Asynchronous work
order: 1
---

# Asynchronous Work

Asynchronous code is common in modern Javascript applications. Testing it is mostly the same as testing synchronous code, except for one key difference: Jasmine needs to know when the asynchronous work is finished.


Jasmine supports three ways of managing asynchronous work: `async`/`await`, promises, and callbacks. If Jasmine doesn't detect one of these, it will assume that the work is synchronous and move on to the next thing in the queue as soon as the function returns. All of these mechanisms work for `beforeEach`, `afterEach`, `beforeAll`, `afterAll`, and `it`.

## `async`/`await`
Usually, the most convenient way to write async tests is to use `async`/`await`. `async` functions implicitly return a promise. Jasmine will wait until the returned promise is either resolved or rejected before moving on to the next thing in the queue. Rejected promises will cause a spec failure, or a suite-level failure in the case of `beforeAll` or `afterAll`.

```javascript
beforeEach(async function() {
  await someLongSetupFunction();
});

it('does a thing', async function() {
  const result = await someAsyncFunction();
  expect(result).toEqual(someExpectedValue);
});
```

Note that in order to use `async`/`await` you need to either run your tests in a browser or Node version that supports it, or else use [Babel](https://babeljs.io/) to compile your code to an older dialect of Javascript. `async`/`await` is supported by Jasmine 2.7 and later.


## Promises
If you can't use `async`/`await` or you need more control, you can explicitly return a promise instead. Jasmine considers any object with a `then` method to be a promise, so you can use either the Javascript runtime's built-in `Promise` type or a library.

```javascript
beforeEach(function() {
  return new Promise(function(resolve, reject) {
    // do something asynchronous
    resolve();
  });
});

it('does a thing', function() {
  return someAsyncFunction().then(function (result) {
    expect(result).toEqual(someExpectedValue);
  });
});
```

Promise-returning asynchronous functions are supported by Jasmine 2.7 and later.


## Callbacks
It's also possible to write asynchronous tests using callbacks. This is a lower-level mechanism and tends to be more error-prone, but it can be useful for testing callback-based code or for tests that are inconvenient to express in terms of promises. If the function passed to Jasmine takes an argument (traditionally called `done`), Jasmine will pass a function to be invoked when asynchronous work has been completed.

It's vital that the `done` callback be called exactly once, and that calling `done` be the last thing done by the asynchronous function or any of the functions that it calls. A common mistake when writing callback-style asynchronous tests is to call `done` when the code under test is still running. In that case, errors thrown after `done` is called might be associated with a different spec than the one that caused them or even not reported at all.


```javascript
beforeEach(function(done) {
  setTimeout(function() {

    // do some stuff

    done();

  }, 100);
});


it('does a thing', function(done) {
  someAsyncFunction(function(result) {
    expect(result).toEqual(someExpectedValue);
    done();
  });
});

```

## Handling failures

Sometimes things don't work in your asynchronous code, and you want your specs to fail correctly. Any unhandled errors are caught by Jasmine and sent to the spec that is currently being executed. Sometimes you need to explicitly cause your spec to fail.

### Failing with promises

A rejected `Promise` will cause the spec to fail, in the same way that throwing an error does.

```javascript
beforeEach(function() {
  return somePromiseReturningFunction();
});

it('does a thing', function() {
  // Since `.then` propagates rejections, this test will fail if
  // the promise returned by asyncFunctionThatMightFail is rejected.
  return asyncFunctionThatMightFail().then(function(value) {
    // ...
  });
});

function somePromiseReturningFunction() {
  return new Promise(function(resolve, reject) {
    if (everythingIsOk()) {
      resolve();
    } else {
      reject();
    }
  });
}
```

### Failing with `async`/`await`
Since `async`/`await` is syntactic sugar for promises, `async`/`await` functions can indicate failure by either returning a rejected promise or by throwing an error.

```javascript
beforeEach(async function() {
  // Will fail if the promise returned by
  // someAsyncFunction is rejected.
  await someAsyncFunction();
});

it('does a thing', async function() {
  // Will fail if doSomethingThatMightThrow throws.
  doSomethingThatMightThrow();

  // Will fail if the promise returned by
  // asyncFunctionThatMightFail is rejected.
  const value = await asyncFunctionThatMightFail();
  // ...
});
```

### Failing with callbacks

Since Jasmine 2.1, the `done` function passed as a callback can also be used to fail the spec by using `done.fail()`, optionally passing a message or an `Error` object.

```javascript
beforeEach(function(done) {
  setTimeout(function() {
    try {
      riskyThing();
      done();
    } catch (e) {
      done.fail(e);
    }
  });
});
```

Since Jasmine 3.0, the `done` function will also detect an `Error` passed directly to it to cause the spec to fail.

```javascript
beforeEach(function(done) {
  setTimeout(function() {
    var err = null;

    try {
      riskyThing();
    } catch (e) {
      err = e;
    }

    done(err);
  });
});
```

## Reporters

As of Jasmine 3.0, reporter event handlers can also be asynchronous with any of these methods. Note that all reporter events already receive data, so if you're using the callback method, the `done` callback should be the last parameter.

## Using the mock clock to avoid writing asynchronous tests

If an operation is asynchronous just because it relies on setTimeout or other time-based behavior, a good way to test it is to use Jasmine’s [mock clock](/api/edge/Clock.html) to make it run synchronously. This type of test can be easier to write and will run faster than an asynchronous test that actually waits for time to pass.

```javascript
function doSomethingLater(callback) {
  setTimeout(function() {
    callback(12345);
  }, 10000);
}

describe('doSomethingLater', function() {
  beforeEach(function() {
    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('does something after 10 seconds', function() {
    const callback = jasmine.createSpy('callback');
    doSomethingLater(callback);
    jasmine.clock().tick(10000);
    expect(callback).toHaveBeenCalledWith(12345);
  });
});
```
