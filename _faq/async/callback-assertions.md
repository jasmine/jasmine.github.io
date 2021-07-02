---
question: I need to assert something about the arguments passed to an async callback that happens before the code under test is finished. What's the best way to do that?
---

Consider a `DataFetcher` class that fetches data, calls any registered
callbacks, does some cleanup, and then finally resolves a returned promise. The
best way to write a spec that verifies the arguments to the callback is to save
the arguments off in the callback and then assert that they have the right
values just before signalling completion:

```javascript
it("calls the onData callback with the expected args", async function() {
  const subject = new DataFetcher();
  let receivedData;
  subject.onData(function(data) {
    receivedData = data;
  });

  await subject.fetch();

  expect(receivedData).toEqual(expectedData);
});
```

You can also get better failure messages by using a spy:

```javascript
it("calls the onData callback with the expected args", async function() {
  const subject = new DataFetcher();
  const callback = jasmine.createSpy('onData callback');
  subject.onData(callback);

  await subject.fetch();

  expect(callback).toHaveBeenCalledWith(expectedData);
});
```

It's tempting to write something like this:

```javascript
// WARNING: Does not work
it("calls the onData callback with the expected args", async function() {
  const subject = new DataFetcher();
  subject.onData(function(data) {
    expect(data).toEqual(expectedData);
  });

  await subject.fetch();
});
```

But that will incorrectly pass if the `onData` callback is never called,
because the expectation never runs. Here's another common but incorrect
approach:

```javascript
// WARNING: Does not work
it("calls the onData callback with the expected args", function(done) {
  const subject = new DataFetcher();
  subject.onData(function(data) {
    expect(data).toEqual(expectedData);
    done();
  });

  subject.fetch();
});
```

In that version, the spec signals completion before the code under test
actually finishes running. That can cause the spec's execution to interleave
with other specs, which can lead to [misrouted errors and other problems](#late-failures).
