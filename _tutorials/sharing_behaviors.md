---
title: Sharing behaviors
layout: article
---
# Sharing behaviors

Sometimes you may have multiple classes or methods that have similar behaviors, and you
want to test those behaviors for all of them without writing duplicate specs. There are
a number of ways to do this depending on your needs.

## Inline describe/it loops

Using an inline loop to define `describe` or `it` blocks can avoid duplication for many
identical, simple tests.

```js
describe('Element', function() {
  beforeEach(function() {
    this.subject = new Element();
  });

  ['x', 'y', 'width', 'height'].forEach(name => {
    describe(name, function() {
      it('returns a number', function() {
        expect(typeof this.subject[name]()).toBe('number');
      });
    });
  });
});
```

## Spec declaration helper

Creating a separate helper function that declares `describe` or `it` blocks allows you
to reuse it in multiple tests. This may be useful when describing shared behaviors.

```js
// Note that this function can exist outside any jasmine block, as long as you
// only call it from inside a jasmine block.
function itActsLikeAPet() {
  it('can be fed', function() {
    this.subject.feed();
    expect(this.subject.hungry()).toBe(false);
  });

  it('can be watered', function() {
    this.subject.drink();
    expect(this.subject.thirsty()).toBe(false);
  });
}

describe('Dog', function() {
  beforeEach(function() {
    this.subject = new Dog();
  });

  itActsLikeAPet();

  it('can bark', function() {
    this.subject.bark();
  });
});

describe('Cat', function() {
  beforeEach(function() {
    this.subject = new Cat();
  });

  itActsLikeAPet();

  it('can meow', function() {
    this.subject.meow();
  });
});
```

## Caveats

Sharing behaviors in tests can be a powerful tool, but use them with caution.

- Overuse of complex helper functions can lead to logic in your tests, which
  in turn may have bugs of its own - bugs that could lead you to think you're
  testing something that you aren't. Be especially wary about conditional logic
  (if statements) in your helper functions.

- Having lots of tests defined by test loops and helper functions can make life harder
  for developers. For example, searching for the name of a failed spec may be
  more difficult if your test names are pieced together at runtime. If requirements
  change, a function may no longer "fit the mold" like other functions, forcing the
  developer to do more refactoring than if you had just listed out your tests separately.
