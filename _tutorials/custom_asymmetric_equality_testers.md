---
title: Custom Asymmetric Equality Testers
layout: article
redirect_from: /tutorials/custom_argument_matchers
---
# Custom Asymmetric Equality Testers

Jasmine provides a number of asymmetric equality testers out of the box, such
as [`jasmine.any()`](/api/edge/jasmine.html#.any) and
[`jasmine.objectContaining()`](/api/edge/jasmine.html#.objectContaining).
When it's helpful, you can create your own custom asymmetric equality testers
to encapsulate testing logic.

To start, create a function that returns an object. The object must provide an `asymmetricMatch`
function.

```js
function multipleOf(number) {
  return {
    /*
     * The asymmetricMatch function is required, and must return a boolean.
     */
    asymmetricMatch: function(compareTo) {
      return compareTo % number === 0;
    },

    /*
     * The jasmineToString method is used in the Jasmine pretty printer. Its
     * return value will be seen by the user in the message when a test fails.
     */
    jasmineToString: function() {
      return '<multipleOf: ' + number + '>';
    }
  };
}
```

After defining your custom asymmetric equality tester, you can use it in your
tests.

```js
spyOn(Buffer, 'alloc').and.callThrough();

Buffer.alloc(2048);

expect(Buffer.alloc).toHaveBeenCalledWith(multipleOf(1024));
```

Just like Jasmine's built-in asymmetric equality testers, yours can be nested
inside an array or object and will work correctly.

```js
spyOn(request, 'post');

request.post({ name: 'Jan Jansen', age: 40 });

expect(request.post).toHaveBeenCalledWith({ name: jasmine.any(String), age: multipleOf(10) });
```

Just like Jasmine's built-in asymmetric equality testers, yours can be used
anywhere Jasmine does an equality check.

```js
expect(10).toEqual(multipleOf(5));

expect({ x: 3, y: 9 }).toEqual({ x: multipleOf(3), y: multipleOf(3) });
```
