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

  for (const name of ['x', 'y', 'width', 'height']) {
    describe(name, function() {
      it('returns a number', function() {
        expect(typeof this.subject[name]()).toBe('number');
      });
    });
  };
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

- Sharing doesn't just remove duplication, it also creates coupling. Sharing
  behaviors makes it more difficult to handle situations where one of the suites
  involved needs to do something slightly different. If requirements
  change, a function may no longer "fit the mold" like other functions, forcing
  the developer to do more refactoring than if you had just listed out your 
  tests separately.It's often more important for test code to be decoupled than
  for it to be DRY.

- Sharing doesn't just remove duplication, it also tends to make the code harder
  to understand. Readers often need to "ping pong" back and forth between the
  shared portion and the non-shared portion to understand what's going on. It's 
  often more important for test code to be obvious than for
  it to be DRY.

- Overuse of complex helper functions can lead to more logic in your tests, which
  in turn may have bugs of its own - bugs that could lead you to think you're
  testing something that you aren't. Be especially wary about conditional logic
  (if statements) in your helper functions.

- Having lots of tests defined by test loops and helper functions can make life harder
  for developers. For example, searching for the name of a failed spec may be
  more difficult if your test names are pieced together at runtime. Stack traces
  can also be less useful, particularly in async specs, because they may point
  only to shared code.

Good questions to ask yourself if you're considering sharing behavior:

- Is it important that all the suites in question work the same, or is it just
  more convenient? How confident are you that a change to one of them should 
  affect all of them?

- What message are you trying to send to future maintainers? Are you trying to
  say "these things should all behave the same"? Or is that message just a side
  effect of de-duplication?

- How easy is it to understand the resulting test code?

- How easy is it to debug failures?

- If the behavior was duplicated instead of shared, how hard would it be to 
  maintain?