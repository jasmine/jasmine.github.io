---
question: Why is Jasmine showing an exception with no stack trace?
---

JavaScript allows you to throw any value or reject a promise with any value. 
However, only `Error` objects have stack traces. So if a non-`Error` is thrown 
or a promise is rejected with something other than an `Error`, Jasmine can't
show the stack trace because there is no stack trace to show.

This behavior is controlled by the JavaScript runtime and isn't something that
Jasmine can change.

```javascript
// NOT RECOMMENDED
describe('Failures that will not have stack traces', function() {
  it('throws a non-Error', function() {
    throw 'nope';
  });

  it('rejects with a non-Error', function() {
    return Promise.reject('nope');
  });
});

// RECOMMENDED
describe('Failures that will have stack traces', function() {
  it('throws an Error', function() {
    throw new Error('nope');
  });

  it('rejects with an Error', function() {
    return Promise.reject(new Error('nope'));
  });
});
```