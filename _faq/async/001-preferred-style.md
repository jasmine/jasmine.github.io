---
question: Which async style should I use, and why?
slug: preferred-style
---

The `async`/`await` style should be your first choice. Most developers have a
much easier time writing error-free specs in that style. Promise-returning
specs are a bit harder to write, but they can be useful in more complex
scenarios.
Callback style specs are very error-prone and should be avoided if possible.

There are two major drawbacks to callback style specs. The first is that the
flow of execution is harder to visualize. That makes it easy to write a spec
that calls its `done` callback before it's actually finished. The second is
that it's difficult to handle errors correctly. Consider this spec:

```javascript
it('sometimes fails to finish', function(done) {
  doSomethingAsync(function(result) {
    expect(result.things.length).toEqual(2);
    done();
  });
});
```

If `result.things` is undefined, the access to `result.things.length` will throw
an error, preventing `done` from being called. The spec will eventually time out
but only after a significant delay. The error will be reported. But because of
the way browsers and Node expose information about unhandled exceptions, it 
won't include a stack trace or any other information that indicates the source
of the error.

Fixing that requires wrapping each callback in a try-catch:

```javascript
it('finishes and reports errors reliably', function(done) {
  doSomethingAsync(function(result) {
    try {
      expect(result.things.length).toEqual(2);
    } catch (err) {
      done.fail(err);
      return;
    }

    done();
  });
});
```

That's tedious, error-prone, and likely to be forgotten. It's often better to
convert the callback to a promise:

```javascript
it('finishes and reports errors reliably', async function() {
  const result = await new Promise(function(resolve, reject) {
    // If an exception is thrown from here, it will be caught by the Promise
    // constructor and turned into a rejection, which will fail the spec.
    doSomethingAsync(resolve);
  });

  expect(result.things.length).toEqual(2);
});
```

Callback-style specs are still useful in some situations. Some callback-based
interfaces are difficult to promisify or don't benefit much from being
promisified. But in most cases it's easier to write a reliable spec using
`async`/`await` or at least promises.
