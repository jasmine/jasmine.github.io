---
layout: article
title: Testing a React app with Jasmine npm
---

# Testing a React app with Jasmine npm

The [Jasmine NPM](/setup/nodejs.html) package was originally designed just to run tests against your Node.js code, but with a couple of other packages, you can get it to run your react specs as well. This tutorial assumes you're using [babel](https://www.npmjs.com/package/babel) to compile your code and [enzyme](https://www.npmjs.com/package/enzyme) to test it. We'll also be using [jsdom](https://www.npmjs.com/package/jsdom) to provide a fake HTML DOM for the tests.

Install these packages if you haven't already:

```shell
$ yarn add --dev babel-cli \
                 @babel/register \
                 babel-preset-react-app \
                 cross-env \
                 enzyme \
                 enzyme-adapter-react-16 \
                 jasmine-enzyme \
                 jsdom \
                 jasmine
```

Then initialize Jasmine:

```shell
$ yarn run jasmine init
```

With Jasmine initialized, the first thing we'll do is make a helper to register babel into the `require` chain. This will cause TypeScript files to be compiled to Javascript on the fly when they're loaded. Make a new file called `babel.js` in the `spec/helpers` directory:

```javascript
require('@babel/register');
```

Or, if using TypeScript:

```javascript
require('@babel/register')({
    "extensions": [".js", ".jsx", ".ts", ".tsx"]
});

```


Then we'll want to make sure that we have enzyme loaded up, so make another file in `spec/helpers`, we'll call this one `enzyme.js` for Javascript or `enzyme.ts` for TypeScript. (The file extension is important. While most of the helpers can be `.js` regardless of whether we're using Javascript or TypeScript, this one has to be `.ts` in a TypeScript project. Otherwise the type definitions for `jasmine-enzyme` won't be imported and spec files that use those matchers will fail to type check.)

```javascript
import jasmineEnzyme from 'jasmine-enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

beforeEach(function() {
  jasmineEnzyme();
});
```

And finally, `jsdom.js` in `spec/helpers`:

```javascript
import {JSDOM} from 'jsdom';

const dom = new JSDOM('<html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;
```

In order to ensure these files are loaded first, we'll edit `spec/support/jasmine.json`. We need the Babel helper to be loaded before any other helpers, so we modify it like so:

```json
"helpers": [
  "../spec/helpers/babel.js",
  "../spec/helpers/**/*.js"
],
```

Or, if using Typescript:

```json
"helpers": [
  "../spec/helpers/babel.js",
  "../spec/helpers/**/*.{js,ts}"
],
```

It's common for React code to import CSS or image files. Normally those imports are resolved at build time but they'll produce errors when the tests are run in Node. To fix that, we add one more package:

```shell
$ yarn add --dev ignore-styles
```

And put the following code in `spec/helpers/exclude.js`.

```javascript
import 'ignore-styles';
```

We need to tell Babel what flavor of Javascript we want by adding the following to `package.json`:

```json
  "babel": {
    "presets": [
     "react-app"
    ]
  }
```

You also might want to change the way that Jasmine looks for spec files. Jasmine traditionally looks for files in the `spec` directory with names ending in `.spec.js`, but a common convention in React projects is to put spec files in the same directories as the code they test and give them names ending in `.test.js`. If you want to follow that convention, change the `spec_dir`, `spec_files`, and `helpers` setting in `spec/support/jasmine.json` accordingly:

```json
  "spec_dir": "src",
  "spec_files": [
    "**/*.test.*"
  ],
  "helpers": [
    "../spec/helpers/babel.js",
    "../spec/helpers/**/*.js"
  ],

```

Or, for TypeScript:
```json
  "spec_dir": "src",
  "spec_files": [
    "**/*.test.*"
  ],
  "helpers": [
    "../spec/helpers/babel.js",
    "../spec/helpers/**/*.{js,ts}"
  ],

```

Finally, set up the `test` script in `package.json` to run Jasmine:

```json
  "scripts": {
    "test": "cross-env NODE_ENV=test jasmine",
```

You're all set. [Write your specs](/tutorials/your_first_suite.html) and run them:

```shell
$ yarn test
```
