---
question: How can I configure a spy to return a rejected promise without triggering an unhandled promise rejection error?
---

It’s important to understand that the JavaScript runtime decides which promise rejections are considered unhandled, not Jasmine. Jasmine just responds to the unhandled rejection event emitted by the JavaScript runtime.

Simply creating a rejected promise is enough to trigger an unhandled rejection
event in Node and most browsers if you allow control to return to the JavaScript
runtime without attaching a rejection handler. That's true even if you don't do
anything with the promise. Jasmine turns unhandled rejections into failures
because they almost always mean that something unexpectedly went wrong. (See also: [I'm getting an unhandled promise rejection error but I think it's a false positive](#unhandled-rejection).)

Consider this spec:

```javascript
it('might cause an unhandled promise rejection', async function() {
  const foo = jasmine.createSpy('foo')
    .and.returnValue(Promise.reject(new Error('nope')));
  await expectAsync(doSomething(foo)).toBeRejected();
});
```

The spec creates a rejected promise. If everything works correctly, it'll be
handled, ultimately by the async matcher. But if `doSomething` fails to call
`foo` or fails to pass the rejection along, the browser or Node will trigger an
unhandled promise rejection event. Jasmine will treat that as a failure of the
suite or spec that's running at the time of the event.

One fix is to create the rejected promise only when the spy is actually called:

```javascript
it('does not cause an unhandled promise rejection', async function() {
  const foo = jasmine.createSpy('foo')
    .and.callFake(() => Promise.reject(new Error('nope')));
  await expectAsync(doSomething(foo)).toBeRejected();
});
```
You can make this a bit clearer by using the
[rejectWith]({{ site.github.url }}/api/edge/SpyStrategy.html#rejectWith) spy strategy:

```javascript
it('does not cause an unhandled promise rejection', async function() {
  const foo = jasmine.createSpy('foo')
    .and.rejectWith(new Error('nope'));
  await expectAsync(doSomething(foo)).toBeRejected();
});
```

As mentioned above, Jasmine doesn't determine which rejections count as
unhandled. Please don't open issues asking us to change that.
