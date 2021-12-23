---
question: Why can't my asynchronous function call `done` more than once? What should I do instead?
---

In Jasmine 2.x and 3.x, a [callback-based async function](/tutorials/async)
could call its `done` callback any number of times, and only the first call did
anything. This was done to prevent Jasmine from corrupting its internal state
when `done` was called more than once.

We've learned since then that it's important for asynchronous functions to only
signal completion when they're actually done. When a spec keeps running after it
tells Jasmine that it's done, it interleaves with the execution of other specs.
This can cause problems like intermittent test failures, failures not being
reported, or [failures being reported on the wrong spec](#late-failures).
Problems like these have been a common source of user confusion and bug reports
over the years. Jasmine 4 tries to make them easier to diagnose by reporting
an error any time an asynchronous function calls `done` more than once.

If you have a spec that calls `done` multiple times, the best thing to do is to
rewrite it to only call `done` once. See [this related FAQ](#010-mixed-style)
for some common scenarios where specs signal completion multiple times and
suggested fixes.

If you really can't eliminate the extra done calls, you can implement the
Jasmine 2-3 behavior by wrapping `done` in a function that ignores all but the
first call, as follows. But be aware that specs that do this are still buggy
and still likely to cause the problems outlined above.


```javascript
function allowUnsafeMultipleDone(fn) {
  return function(done) {
    let doneCalled = false;
    fn(function(err) {
      if (!doneCalled) {
        done(err);
        doneCalled = true;
      }
    });
  }
}

it('calls done twice', allowUnsafeMultipleDone(function(done) {
  setTimeout(done);
  setTimeout(function() {
    // This code may interleave with subsequent specs or even run after Jasmine
    // has finished executing.
    done();
  }, 50);
}));
```
