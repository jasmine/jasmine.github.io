---
question: How can I mock AJAX calls?
---

If you're using `XMLHttpRequest` or any library that uses it under the hood,
[jasmine-ajax](https://github.com/jasmine/jasmine-ajax) is a good choice. It
takes care of the sometimes intricate details of mocking `XMLHttpRequest` and
provides a nice API for verifying requests and stubbing responses.

Newer HTTP client APIs like [axios](https://www.npmjs.com/package/axios) or
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) are easier
to mock by hand using Jasmine spies. Simply inject the HTTP client into the
code under test:

```javascript
async function loadThing(thingId, thingStore, fetch) {
  const url = `http://example.com/api/things/{id}`;
  const response = await fetch(url);
  thingStore[thingId] = response.json();
}

// somewhere else
await loadThing(thingId, thingStore, fetch);
```

Then, in the spec, inject a spy:

```javascript
describe('loadThing', function() {
  it('fetches the correct URL', function() {
    const fetch = jasmine.createSpy('fetch')
      .and.returnValue(new Promise(function() {}));

    loadThing(17, {}, fetch);

    expect(fetch).toHaveBeenCalledWith('http://example.com/api/things/17');
  });

  it('stores the thing', function() {
    const payload = return {
      id: 17,
      name: 'the thing you requested'
    };
    const response = {
      json: function() {
        return payload;
      }
    };
    const thingStore = {};
    const fetch = jasmine.createSpy('fetch')
      .and.returnValue(Promise.resolve(response));

    loadThing(17, thingStore, fetch);

    expect(thingStore[17]).toEqual(payload);
  });
});
```
