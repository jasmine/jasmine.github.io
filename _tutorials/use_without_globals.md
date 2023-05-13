---
layout: faq # FAQ styling for lists and code blocks is right for this page
---

<h1>Using Jasmine without global functions</h1>

Normally, Jasmine creates globals like `describe`, `it`, and `expect` that you
can use to write your specs. If you're running Jasmine
4.0 or later via Node.js you also have the option of importing the Jasmine
interface rather than having Jasmine create globals.

<h2 markdown="1">Initialization when using the `jasmine` NPM package</h2>

Pass `{globals: false}` to the [Jasmine constructor](/api/npm/edge/Jasmine.html):

```javascript
const Jasmine = require('jasmine');
const runner = new Jasmine({globals: false});
```

Or, if running in parallel:

```javascript
const ParallelRunner = require('jasmine/parallel');
const runner = new ParallelRunner({
    numWorkers: 3,
    globals: false
});
```


<h2 markdown="1">Initialization when using `jasmine-core` directly</h2>

Initialize jasmine-core by calling `noGlobals` instead of `boot`:

```javascript
const jasmine = require('jasmine-core').noGlobals().jasmine;
```

<h2>Writing spec and helper files</h2>

In each of your spec and helper files, use the jasmine-core module's noGlobals
function to obtain the things that would normally be provided as
[globals](/api/edge/global):

```javascript
const {describe, beforeEach, it, expect, jasmine} = require('jasmine-core').noGlobals();
```

Then [write your specs](./your_first_suite) as usual.
