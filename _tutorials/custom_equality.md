---
layout: article
redirect_from: "/edge/custom_equality.html"
title: Custom Equality Testers
---

# Custom Equality Testers

You can customize how jasmine determines if two objects are equal by defining your own custom equality testers.

A _custom equality tester_ is a function that takes two arguments. If the custom equality tester knows how to compare the two items, it should return either `true` or `false`. Otherwise, it should return `undefined`, to tell jasmine's equality tester that it can't compare the items.

```javascript
function myCustomTester(first, second) {
  if (typeof first === 'string' && typeof second === 'string') {
    return first[0] === second[1];
  }
}
```

Then, register your tester in a `beforeEach` so jasmine knows about it.

```javascript
beforeEach(function() {
  jasmine.addCustomEqualityTester(myCustomTester);
});
```

Now when you do comparisons in a spec, your custom equality testers will be checked first before falling back to the default equality tests. Note that if your custom tester returns false, no other equality checking will be performed.

```javascript
it('is equal using a custom tester', function () {
  expect('abc').toEqual(' a ');
});

it('is not equal using a custom tester', function () {
  expect('abc').not.toEqual('abc');
});

it('works even in nested equality tests', function () {
  expect(['abc', '123'].toEqual([' a ', ' 1 ']);
});
```
