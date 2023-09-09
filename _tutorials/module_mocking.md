---
layout: article
title: Module Mocking
---

<div class="warning">Note: This guide deals with rapidly changing parts of the
JavaScript ecosystem and may become out of date. It was last updated in 
September 2023. Some of the approaches described and tools mentioned in this
article rely on unstable APIs, private APIs, or implementation details of Node,
bundlers, transpilers, etc. that may change in the future.</div>

<p></p>

# Module Mocking

Module mocking is a popular alternative to dependency injection in which tests
replace hard-wired dependencies with mocks. Module mocking can be done in most 
environments, but the technique varies from environment to environment and in 
many cases third party tools are required.

## Advantages and disadvantages of module mocking

The biggest advantage of module mocking is that it lets you easily test code
that is tightly coupled to its dependencies. This can be very convenient, 
especially if you're testing legacy code that wasn't designed with testability
in mind or you've decided that you prefer hard-wiring over dependency injection.

The biggest disadvantage of module mocking is *also* that it lets you easily
test code that is tightly coupled to its dependencies. As a result, the act of
writing tests will no longer give you feedback about excessive coupling.

Another major disadvantage of module mocking is that it alter global state that
the code under test depends on. This makes tests *flaky by default*: each test
that interacts with a mocked module will affect the behavior of the tests that
follow unless the mocks are reset to their original configuration between tests.

Module mocking also "sands against the grain" of the JavaScript language. It
involves module A mutating what appear to be local variables inside module B,
without B's knowledge or involvement. This can be confusing because it doesn't 
happen anywhere else in JavaScript. It can also cause problems in cases where 
the mocking technique conflicts with the specification of the module system or 
the language itself.


## So you want to use module mocking anyway

Here are some recipes that might help. Most of them include links to complete
working examples.

To choose the right recipe you'll need to know a bit about how your code is
compiled, bundled, and loaded. In most cases, what matters is the kind of code
that's actually loaded into Node or the browser. So for instance, if your code
is compiled to CommonJS modules, you need a CommonJS module mocking approach
even if the source code contains `import` statements.

Unless otherwise specified, all of these recipes assume that you aren't using
Webpack or any other bundler.

* [ES modules in the browser using jasmine-browser-runner](#es-modules-in-the-browser-using-jasmine-browser-runner)
* [CommonJS modules in Node without additional tools](#commonjs-modules-in-node-without-additional-tools)
* [TypeScript with CommonJS output in Node without additional tools](#typescript-with-commonjs-output-in-node-without-additional-tools)
* [CommonJS modules in Node using Testdouble.js](#commonjs-modules-in-node-using-testdoublejs)
* [ES modules in Node using Testdouble.js](#es-modules-in-node-using-testdoublejs)
* [Webpack](#webpack)
* [Angular](#angular)

### ES modules in the browser using jasmine-browser-runner

If your code is in ES modules and you test it using jasmine-browser-runner, you
can use [import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
to mock modules. An import map overrides the browser's default module
resolution, allowing you to substitute a mock version. For instance, if you have
a "real" module in `src/anotherModule.mjs` and a mock version in 
`mockModules/anotherModule.mjs`, you can cause the mock to be loaded instead of
the real one with this configuration.

```
// jasmine-browser.json
{
  "srcDir": "src",
  // ...
  "importMap": {
    "moduleRootDir": "mockModules",
    "imports": {
      "anotherModule": "./anotherModule.mjs"
    }
  }
}
```
```javascript
// src/anotherModule.mjs
export function theString() {
    return 'the string';
}
```
```javascript
// mockModules/anotherModule.mjs
export let theString = jasmine.createSpy('theString');

// IMPORTANT:
// Reset after each spec to prevent spy state from leaking to the next spec
afterEach(function() {
    theString = jasmine.createSpy('theString');
});
```

The good news is that this technique relies entirely on standard features of the
ES module system, so it's very unlikely to break in the future. The bad news is
that it's entirely global. You can't mock a module only in some of your tests
or use different mocks in different tests. Browsers don't provide the module
loader extension hooks that would allow for that behavior.

[Complete working example](https://github.com/jasmine/jasmine.github.io/tree/master/examples/module-mocking/browser-import-maps)


### CommonJS modules in Node without additional tools

If you use CommonJS modules in Node, you can mock them without any additional
tools as long as you don't destructure them.

```javascript
// aModule.js
// Destructuring (e.g. const {theString} = require('./anotherModule.js');) will
// prevent code outside this file from replacing toString.
const anotherModule = require('./anotherModule.js');

function quote() {
    return '"' + anotherModule.theString() + '"';
}

module.exports = { quote };
```
```javascript
// aModuleSpec.js
const anotherModule = require('../anotherModule');
const subject = require('../aModule');

describe('aModule', function() {
    describe('quote', function () {
        it('quotes the string returned by theString', function () {
            // Spies installed with spyOn are automatically cleaned up by
            // Jasmine between tests.
            spyOn(anotherModule, 'theString').and.returnValue('a more different string');
            expect(anotherModule.theString()).toEqual('a more different string');
            expect(subject.quote()).toEqual('"a more different string"');
        });
    });
});
```

This imposes a constraint on how code is written, because it won't work if
`aModule` destructures `anotherModule`. But it doesn't require any extra tools,
and because the mocking is done via `spyOn`, you can rely on Jasmine to
automatically clean it up at the end of the test.


[Complete working example](https://github.com/jasmine/jasmine.github.io/tree/master/examples/module-mocking/node-cjs)


### TypeScript with CommonJS output in Node without additional tools

<div class="warning">This recipe relies on undocumented details of the 
TypeScript compiler's output that have changed in the past and may change in the
future. It was tested with TypeScript 5.1.0.</div>

Most versions of TypeScript emit CommonJS code that does not destructure
modules. So this source code:

```javascript
import {theString} from './anotherModule';

export function quote() {
    return '"' + theString() + '"';
}
```

is compiled to something like this:

```javascript
const anotherModule_1 = require("./anotherModule");
function quote() {
    return '"' + (0, anotherModule_1.theString)() + '"';
}
```

That allows the approach described in the "CommonJS modules in Node without
additional tools" recipe above to work even if the source code destructures the
module.

```javascript
// aModule.ts
import {theString} from './anotherModule';

export function quote() {
    return '"' + theString() + '"';
}
```
```javascript
// aModuleSpec.ts
import "jasmine";
import {quote} from '../src/aModule';
import * as anotherModule from '../src/anotherModule';

describe('aModule', function() {
    describe('quote', function() {
        it('quotes the string returned by theString', function() {
            spyOn(anotherModule, 'theString').and.returnValue('a more different string');
            expect(quote()).toEqual('"a more different string"');
        });
    });
});
```

This won't work with any version of TypeScript that destructures the
imported module. It also won't work TypeScript 3.9 because that version marks
exported properties read-only.

[Complete working example](https://github.com/jasmine/jasmine.github.io/tree/master/examples/module-mocking/node-typescript-cjs)


### CommonJS modules in Node using Testdouble.js

As well as offering an alternative to Jasmine spies, 
[Testdouble.js](https://github.com/testdouble/testdouble.js/) can hook into the
Node module loader and replace modules with mocks.

```javascript
const td = require('testdouble');

describe('aModule', function() {
    beforeEach(function () {
        this.anotherModule = td.replace('../anotherModule.js');
        this.subject = require('../aModule.js');
    });

    afterEach(function () {
        td.reset();
    });

    describe('quote', function () {
        it('quotes the string returned by theString', function () {
            td.when(this.anotherModule.theString()).thenReturn('a more different string');
            expect(this.subject.quote()).toEqual('"a more different string"');
        });
    });
});
```

If you prefer to use Jasmine spies, you can do that too.

```javascript
const td = require('testdouble');

describe('aModule', function() {
    beforeEach(function () {
        this.anotherModule = td.replace(
            '../anotherModule.js',
            {theString: jasmine.createSpy('anotherModule.theString')}
        );
        this.subject = require('../aModule.js');
    });

    afterEach(function () {
        td.reset();
    });

    describe('quote', function () {
        it('quotes the string returned by theString', function () {
            this.anotherModule.theString.and.returnValue('a more different string');
            expect(this.subject.quote()).toEqual('"a more different string"');
            expect(this.anotherModule.theString).toHaveBeenCalled();
        });
    });
});
```

See [Testdouble's documentation](https://github.com/testdouble/testdouble.js/blob/main/docs/7-replacing-dependencies.md)
for more information.

[Complete working example](https://github.com/jasmine/jasmine.github.io/tree/master/examples/module-mocking/node-cjs-testdouble)


### ES modules in Node using Testdouble.js

<div class="warning">This recipe relies on the
<a href="https://nodejs.org/api/esm.html#loaders">Node module loader API</a>,
which is still experimental as of Node 20.6.1. Future versions of Node may
include breaking changes to the loader API.</div>

Testdouble can also mock ES modules. There are two important differences from
the above CommonJS recipe. The first is that the Testdouble loader must be 
specified on the Node command line. So instead of running `npx jasmine` or
`./node_modules/.bin/jasmine`, run `node --loader=testdouble ./node_modules/.bin/jasmine`.
The second difference is that specs must load modules via async dynamic 
`import()` rather than via `require` or the static `import` statement.

```javascript
import * as td from 'testdouble';

describe('aModule', function() {
    beforeEach(async function () {
        this.anotherModule = await td.replaceEsm('../anotherModule.js');
        this.subject = await import('../aModule.js');
    });

    afterEach(function () {
        td.reset();
    });

    describe('quote', function () {
        it('quotes the string returned by theString', function () {
            td.when(this.anotherModule.theString()).thenReturn('a more different string');
            expect(this.subject.quote()).toEqual('"a more different string"');
        });
    });
});
```

As with the CommonJS recipe above, you can also use Jasmine spies if you prefer.

Due to an interaction between a bug in Testdouble and a bug in older versions of
Jasmine, your Jasmine config file must be `jasmine.js` rather than
`jasmine.json` if you use the Testdouble ESM loader with Jasmine 5.0.x or
earlier. Jasmine 5.1.0 and later allow the use of either a JS or JSON config
file with the Testdouble ESM loader.


[Complete working example using JavaScript](https://github.com/jasmine/jasmine.github.io/tree/master/examples/module-mocking/node-esm-testdouble)<br>
[Complete working example using TypeScript](https://github.com/jasmine/jasmine.github.io/tree/master/examples/module-mocking/node-typescript-esm-testdouble)


### Webpack

Rewiremock is a package that can be used to mock modules in a variety of
situations, including when code is bundled by Webpack. There are a lot of
different ways to configure Rewiremock. See 
[its README](https://github.com/theKashey/rewiremock) for more information.


### Angular

Angular tests should use Angular's robust support for dependency injection
rather than trying to mock properties of modules. Enabling module mocking would
likely require patching the Angular compiler (or rewriting its output) to mark 
exported properties writeable. There aren't currently any known tools that do
that. If there were, it's likely that future Angular releases would break them.


## Contributing to this guide

Do you know how to enable module mocking in an environment that's not covered by
this guide? Please [contribute an addition](https://github.com/jasmine/jasmine.github.io/).
Complete working examples are particularly valuable because they show details of
configuration, package versions, etc. that may turn out to matter in ways that
aren't obvious at first.