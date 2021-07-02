---
question: But I really have to test code that signals success and failure through different channels. I can't (or don't want to) change it. What can I do?
---

You can convert both sides to promises, if they aren't already promises. Then
use `Promise.race` to wait for whichever one is resolved or rejected first:

```javascript
// in DataLoader.js
class DataLoader {
  constructor(fetch) {
    // ...
  }

  subscribe(subscriber) {
    // ...
  }

  onError(errorSubscriber) {
    // ...
  }

  load() {
    // ...
  }
}

// in DataLoaderSpec.js
it('provides the fetched data to observers', async function() {
  const fetch = function() {
    return Promise.resolve(/*...*/);
  };
  let resolveSubscriberPromise, rejectErrorPromise;
  const subscriberPromise = new Promise(function(resolve) {
    resolveSubscriberPromise = resolve;
  });
  const errorPromise = new Promise(function(resolve, reject) {
    rejectErrorPromise = reject;
  });
  const subject = new DataLoader(fetch);

  subject.subscribe(resolveSubscriberPromise);
  subject.onError(rejectErrorPromise);
  const result = await Promise.race([subscriberPromise, errorPromise]);

  expect(result).toEqual(/*...*/);
});
```

Note that this assumes that the code under test either signals success or
signals failure, but never does both. It's generally not possible to write a
reliable spec for async code that might signal both success and failure when
it fails.
