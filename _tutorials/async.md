---
layout: article
title: Asynchronous work
order: 1
---

# Asynchronous Work

Sometimes the code being tested has an asynchronous component. If you can't use the [mock clock](/api/edge/Clock.html), you need a way to let Jasmine know when the asynchronous work has been completed.

Jasmine supports 3 ways of managing asynchronous work: callbacks, Promises, and the `async` keyword. If Jasmine doesn't detect one of these, it will assume that the works is synchronous and move on to the next thing in the queue as soon as the function returns. All of these mechanisms work for `beforeEach`, `afterEach`, `beforeAll`, `afterAll`, and `it`. `describe` can't be executed asynchronously, because your suite should be statically defined.

## Callbacks

Since Jasmine 2.0, if the function passed to Jasmine took an argument (traditionally called `done`), Jasmine will pass a function to be invoked when asynchronous work has been completed.

```javascript
beforeEach(function(done) {
  setTimeout(function() {

    // do some stuff

    done();

  }, 100);
});
```

## Promises

Since Jasmine 2.7, you can return a `Promise` and Jasmine will wait until it is resolved or rejected before moving on to the next thing in the queue. A `Promise` is detected based on the presence of a `then` function on the returned object.

```javascript
beforeEach(function() {
  return new Promise(function(resolve, reject) {

    // do some stuff

    resolve();
  });
});
```

## Async keyword

The `Promise` support added in Jasmine 2.7 also allow the use of the `async` keyword because of how it works under the hood.

```javascript
beforeEach(async function() {
  await someLongFunction();
});
```

## Handling failures

Sometimes things don't work in your asynchronous code, and you want your specs to fail correctly. Since Jasmine 2.6, any unhandled errors are caught by Jasmine and sent to the spec that is currently being executed. Sometimes you need to explicitly cause your spec to fail.

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

### Failing with promises

A rejected `Promise` will cause the spec to fail, in the same way that throwing an error does.

```javascript
beforeEach(function() {
  return new Promise(function(resolve, reject) {
    try {
      riskyThing();
      resolve();
    } catch (e) {
      reject(e);
    };
  });
});
```

# Reporters

As of Jasmine 3.0, reporter event handlers can also be asynchronous with any of these methods. Note that all reporter events already receive data, so if you're using the callback method, the `done` callback should be the last parameter.
