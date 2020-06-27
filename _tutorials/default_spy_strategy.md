---
layout: article
title: Default Spy Strategy
---

# Default Spy Strategy

You can customize the default spy strategy used by Jasmine when it creates spies. Normally, the default strategy
is `.and.stub()`, which returns `undefined` if the spy is called. To change this, use the `jasmine.setDefaultSpyStrategy`
helper in a `beforeEach()` or `beforeAll()` block.

```javascript
beforeEach(function() {
  jasmine.setDefaultSpyStrategy(and => and.returnValue("Hello World"));
});

it("returns the value Hello World", function() {
  var spy = jasmine.createSpy();
  expect(spy()).toEqual("Hello World");
});
```

Call `jasmine.setDefaultSpyStrategy` with no arguments to remove a custom default. This can be helpful if you want
to temporarily create a spy strategy for a series of spies.

```javascript
it("throws if you call any methods", function() {
  jasmine.setDefaultSpyStrategy(and => and.throwError(new Error("Do Not Call Me")));
  var program = jasmine.createSpyObj(["start", "stop", "examine"]);
  jasmine.setDefaultSpyStrategy();

  expect(() => {
    program.start();
  }).toThrowError("Do Not Call Me");
});
```
