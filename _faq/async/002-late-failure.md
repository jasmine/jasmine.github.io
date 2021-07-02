---
question: Why are some asynchronous spec failures reported as suite errors or as failures of a different spec?
slug: late-failures
---

When an exception is thrown from async code or an unhandled promise rejection
occurs, the spec that caused it is no longer on the call stack. So Jasmine has
no reliable way to determine where the error came from. The best Jasmine can do
is associate the error with the spec or suite that was running when it happened.
This is usually the right answer, since correctly-written specs don't trigger
errors (or do anything else) after they signal completion.

It becomes a problem when a spec signals completion before it's actually done.
Consider these two examples, which both test a `doSomethingAsync` function that
calls a callback when it's finished:

```javascript
// WARNING: does not work correctly
it('tries to be both sync and async', function() {
  // 1. doSomethingAsync() is called 
  doSomethingAsync(function() {
    // 3. The callback is called
    doSomethingThatMightThrow();
  });
  // 2. Spec returns, which tells Jasmine that it's done
});

// WARNING: does not work correctly
it('is async but signals completion too early', function(done) {
  // 1. doSomethingAsync() is called 
  doSomethingAsync(function() {
    // 3. The callback is called
    doSomethingThatThrows();
  });
  // 2. Spec calls done(), which tells Jasmine that it's done
  done();
});
```

In both cases the spec signals that it's done but continues executing, later
causing an error. By the time the error occurs, Jasmine has already reported
that the spec passed and started executing the next spec. Jasmine might even
have exited before the error occurs. If that happens, it won't be
reported at all.

The fix is to make sure that the spec doesn't signal completion until it's
really done. This can be done with callbacks:

```javascript
it('signals completion at the right time', function(done) {
  // 1. doSomethingAsync() is called 
  doSomethingAsync(function() {
    // 2. The callback is called
    doSomethingThatThrows();
    // 3. If we get this far without an error being thrown, the spec calls
    // done(), which tells Jasmine that it's done
    done();
  });
});
```

But
[it's easier to write reliable async specs using `async`/`await` or promises](#preferred-style),
so we recommend that in most cases:

```javascript
it('signals completion at the right time', async function() {
  await doSomethingAsync();
  doSomethingThatThrows();
});
```
