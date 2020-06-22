---
layout: article
title: Spying on properties
---

# Spying on properties

Properties are more complicated than functions. In Jasmine, you can do anything with a property spy that you
can do with a function spy, but you may need to use different syntax.

Use `spyOnProperty` to create either a getter or setter spy.

```javascript
it("allows you to create spies for either type", function() {
  spyOnProperty(someObject, "myValue", "get").and.returnValue(30);
  spyOnProperty(someObject, "myValue", "set").and.callThrough();
});
```

Changing the value of an existing spy is more difficult than with a function, because you cannot _refer_ to a property without calling its `getter` method. To get around this, you can save a referene to the spy for later changes.

```javascript
beforeEach(function() {
  this.propertySpy = spyOnProperty(someObject, "myValue", "get").and.returnValue(1);
});

it("lets you change the spy strategy later", function() {
  this.propertySpy.and.returnValue(3);
  expect(someObject.myValue).toEqual(3);
});
```

If saving a reference to the spy is awkward, you can also access it from anywhere in your test using
`Object.getOwnPropertyDescriptor`.

```javascript
beforeEach(function() {
  spyOnProperty(someObject, "myValue", "get").and.returnValue(1);
});

it("lets you change the spy strategy later", function() {
  Object.getOwnPropertyDescriptor(someObject, "myValue").get.and.returnValue(3);
  expect(someObject.myValue).toEqual(3);
});
```

You can create a spy object with several properties on it quickly by passing an array or hash of properties as
a third argument to `createSpyObj`. In this case you won't have a reference to the created spies, so if you
need to change their spy strategies later, you can use the `Object.getOwnPropertyDescriptor` approach.

```javascript
it("creates a spy object with properties", function() {
  let obj = createSpyObj("myObject", {}, { x: 3, y: 4 });
  expect(obj.x).toEqual(3);

  Object.getOwnPropertyDescriptor(obj, "x").get.and.returnValue(7);
  expect(obj.x).toEqual(7);
});
```
