---
title: Custom argument matchers
layout: article
---
# Custom argument matchers

Jasmine provides a number of "argument matchers" (_asymmetric matchers_) out of the box. Asymmetric
matchers are matchers like `jasmine.any()` and `jasmine.objectContaining()`.
When it's helpful, you can create your own custom matchers to encapsulate testing logic.

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
     * The jasmineToString method is used in the Jasmine pretty printer, and will
     * be seen by the user in the message when a test fails.
     */
    jasmineToString: function() {
      return '<multipleOf: ' + number + '>';
    }
  };
}
```

After defining your custom asymmetric matcher, you can use it in your tests.

```js
expect(10).toEqual(multipleOf(5));
expect(7).not.toEqual(multipleOf(3));
```

Just like Jasmine's built-in asymmetric matchers, your custom asymmetric matcher can be nested
inside a larger comparison and will work correctly.

```js
mySpy('/tmp/tmpfile', { size: 2048 });

expect(mySpy).toHaveBeenCalledWith('/tmp/tmpfile', { size: multipleOf(1024) });
```
