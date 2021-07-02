---
question: How can I add more information to matcher failure messages?
---

When a spec has multiple, similar expectations, it can be hard to tell which
failure corresponds to which expectation:

```javascript
it('has multiple expectations', function() {
  expect(munge()).toEqual(1);
  expect(spindle()).toEqual(2);
  expect(frobnicate()).toEqual(3);
});
```

```
Failures:
1) has multiple expectations
  Message:
    Expected 0 to equal 1.
  Stack:
    Error: Expected 0 to equal 1.
        at <Jasmine>
        at UserContext.<anonymous> (withContextSpec.js:2:19)
        at <Jasmine>
  Message:
    Expected 0 to equal 2.
  Stack:
    Error: Expected 0 to equal 2.
        at <Jasmine>
        at UserContext.<anonymous> (withContextSpec.js:3:21)
        at <Jasmine>
```

There are three ways to make the output of a spec like that more clear:

* Put each expectation in its own spec. (This is sometimes a good idea, but not
  always.)
* Write a [custom matcher]({{ site.github.url }}/tutorials/custom_matcher). (This is sometimes worth
  the effort, but not always.)
* Use [withContext]({{ site.github.url }}/api/edge/matchers.html#withContext) to add extra text to
  the matcher failure messages.

Here's the same spec as above, but modified to use `withContext`:

```javascript
it('has multiple expectations with some context', function() {
  expect(munge()).withContext('munge').toEqual(1);
  expect(spindle()).withContext('spindle').toEqual(2);
  expect(frobnicate()).withContext('frobnicate').toEqual(3);
});
```

```
Failures:
1) has multiple expectations with some context
  Message:
    munge: Expected 0 to equal 1.
  Stack:
    Error: munge: Expected 0 to equal 1.
        at <Jasmine>
        at UserContext.<anonymous> (withContextSpec.js:8:40)
        at <Jasmine>
  Message:
    spindle: Expected 0 to equal 2.
  Stack:
    Error: spindle: Expected 0 to equal 2.
        at <Jasmine>
        at UserContext.<anonymous> (withContextSpec.js:9:44)
        at <Jasmine>

```
