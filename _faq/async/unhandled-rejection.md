---
question: I'm getting an unhandled promise rejection error but I think it's a false positive.
---

It's important to understand that the JavaScript runtime decides which promise
rejections are considered unhandled, not Jasmine. Jasmine just responds to the
unhandled rejection event emitted by the JavaScript runtime.

Simply creating a rejected promise is often enough to trigger an unhandled
promise rejection event if you allow control to return to the JavaScript
runtime without first attaching a rejection handler. That's true even if you
don't do anything with the promise. Jasmine turns unhandled rejections into
failures because they almost always mean that something unexpectedly went wrong,
and becuase there's no way to distinguish "real" unhandled rejections from the
ones that would eventually be handled in the future.

Consider this spec:

```
it('causes an unhandled rejection', async function() {
  const rejected = Promise.reject(new Error('nope'));
  await somethingAsync();
  try {
    await rejected;
  } catch (e) {
    // Do something with the error
  }
});
```


The rejection will eventually be handled via the `try`/`catch`.  But the JS
runtime detects the unhandled rejection before that part of the spec runs. This
happens because the `await somethingAsync()` call returns control to the JS
runtime. Different JS runtimes detect unhandled rejections differently, but the
common behavior is that a rejection is not considered unhandled if a catch
handler is attached to it before control is returned to the runtime. In most
cases this can be achieved by re-ordering the code a bit:

```
it('causes an unhandled rejection', async function() {
  const rejected = Promise.reject(new Error('nope'));
  let rejection;
  try {
    await rejected;
  } catch (e) {
    rejection = e;
  }
  await somethingAsync();
  // Do something with `rejection`
});
```

As a last resort, you can suppress the unhandled rejection by attaching a no-op
catch handler:

```
it('causes an unhandled rejection', async function() {
  const rejected = Promise.reject(new Error('nope'));
  rejected.catch(function() { /* do nothing */ });
  await somethingAsync();
  let rejection;
  try {
    await rejected;
  } catch (e) {
   rejection = e;
  }
  // Do something with `rejection`
});
```

See also [How can I configure a spy to return a rejected promise without triggering an unhandled promise rejection error?](#return-reject)
for how to avoid unhandled rejections when configuring spies.

As mentioned above, Jasmine doesn't determine which rejections count as
unhandled. Please don't open issues asking us to change that.
