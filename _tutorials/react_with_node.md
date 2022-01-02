---
layout: article
title: Testing a React app in Node.js with Jasmine
redirect_from: /tutorials/react_with_npm
---

<style>
	#react-with-node-root.npm-selected .yarn { display: none; }
	#react-with-node-root.yarn-selected .npm { display: none; }
</style>

<div id="react-with-node-root" class="yarn-selected" markdown="1">

# Testing a React app in Node.js with Jasmine

The [Jasmine NPM](/setup/nodejs.html) package was originally designed just to 
run specs against your Node.js code, but with a couple of other packages, you 
can use it to run your React specs as well. This tutorial assumes you're using 
[babel](https://www.npmjs.com/package/babel) to compile your code and either
[enzyme](https://www.npmjs.com/package/enzyme) or 
[React Testing Library](https://www.npmjs.com/package/@testing-library/react) 
to test it. We'll also be using [jsdom](https://www.npmjs.com/package/jsdom) 
to provide a fake HTML DOM for the specs.

Choose the package managment tool you'll be using:

<label>
	<input type="radio" name="mgr" value="yarn" checked>
	`yarn` (the default for create-react-app)
</label><br>
<label>
	<input type="radio" name="mgr" value="npm">
	`npm`
</label>


## Basic setup

Install these packages if you haven't already:

<div class="yarn" markdown="1">
```shell
$ yarn add --dev @babel/core \
                 @babel/register \
                 babel-preset-react-app \
                 cross-env \
                 jsdom \
                 jasmine
```
</div>
<div class="npm" markdown="1">
```shell
$ npm install --save-dev @babel/core \
                         @babel/register \
                         babel-preset-react-app \
                         cross-env \
                         jsdom \
                         jasmine
```
</div>

Then initialize Jasmine:

<div class="yarn" markdown="1">
```shell
$ yarn run jasmine init
```
</div>
<div class="npm" markdown="1">
```shell
$ npx jasmine init
```
</div>

That command will create `spec/support/jasmine.json` and populate it with an
initial default configuration. With Jasmine initialized, the first thing we'll 
do is make a helper to register babel into the `require` chain. This will cause 
TypeScript files to be compiled to Javascript on the fly when they're loaded. 
Make a new file called `babel.js` in the `spec/helpers` directory:

```javascript
require('@babel/register');
```

Or, if using TypeScript:

```javascript
require('@babel/register')({
    "extensions": [".js", ".jsx", ".ts", ".tsx"]
});
```

We need to tell Babel what flavor of Javascript we want by adding the following 
to `package.json`:

```json
"babel": {
  "presets": ["react-app"]
}
```

Next, we need to provide a simulated browser environment. Create `jsdom.js` in
`spec/helpers` with the following contents:

```javascript
import {JSDOM} from 'jsdom';

const dom = new JSDOM('<html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;
```

In order to ensure these files are loaded before any specs run, we'll edit 
`spec/support/jasmine.json`. We need the Babel helper to be loaded before any
helpers that contain TypeScript code, so we modify `jasmine.json` like so:

```json
"helpers": [
  "helpers/babel.js",
  "helpers/**/*.js"
],
```

Or, if using Typescript:

```json
"helpers": [
  "helpers/babel.js",
  "helpers/**/*.{js,ts}"
],
```

Next, set up the `test` script in `package.json` to run Jasmine:

```json
  "scripts": {
    "test": "cross-env NODE_ENV=test jasmine",
```


## Handling CSS and image imports

It's common for React code to import CSS or image files. Normally those imports
are resolved at build time but they'll produce errors when the specs are run in 
Node. To fix that, we add one more package:

<div class="yarn" markdown="1">
```shell
$ yarn add --dev ignore-styles
```
</div>
<div class="npm" markdown="1">
```shell
$ npm install --save-dev ignore-styles
```
</div>

And put the following code in `spec/helpers/exclude.js`.

```javascript
import 'ignore-styles';
```

## Optional: Configuring Jasmine to load files with `.jsx` or `.tsx` extensions

By default, Jasmine 4 loads specs and helpers using dynamic `import()`, which
supports ES modules but doesn't support nonstandard (but common) extensions
like `.jsx` and `.tsx`. You can enable support for those extensions
`jsLoader: "require"` to `spec/support/jasmine.json`. Note that if you do this,
Jasmine will only load specs or helpers as ES modules if their names end in
`.mjs`.


## Optional: Spec file pattern configuration

You also might want to change the way that Jasmine looks for spec files. 
Jasmine traditionally looks for files in the `spec` directory with names ending
in `.spec.js`, but a common convention in React projects is to put spec files
in the same directories as the code they test and give them names ending in 
`.test.js`. If you want to follow that convention, change the `spec_dir`,
`spec_files`, and `helpers` setting in `spec/support/jasmine.json` accordingly:

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


## Setting up a React testing utility

We'll need a way to render React components and inspect the result. There are
several utility libraries that provide that functionality. The most popular are
[enzyme](https://www.npmjs.com/package/enzyme) and 
[React Testing Library](https://www.npmjs.com/package/@testing-library/react).


### Enzyme

To set up Enzyme, we'll first install these packages:

<div class="yarn" markdown="1">
```shell
$ yarn add --dev enzyme \
                 enzyme-adapter-react-16 \
                 jasmine-enzyme
```
</div>
<div class="npm" markdown="1">
```shell
$ npm install --save-dev enzyme \
                         enzyme-adapter-react-16 \
                         jasmine-enzyme
```
</div>

Then we'll want to make sure that we have enzyme loaded up, so make another
file in `spec/helpers`, we'll call this one `enzyme.js` for Javascript or
`enzyme.ts` for TypeScript. (The file extension is important. While most of the
helpers can be `.js` regardless of whether we're using Javascript or 
TypeScript, this one has to be `.ts` in a TypeScript project. Otherwise the 
type definitions for `jasmine-enzyme` won't be imported and spec files that use 
those matchers will fail to type check.)

```javascript
import jasmineEnzyme from 'jasmine-enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

beforeEach(function() {
  jasmineEnzyme();
});
```

See the
[Enzyme documentation](https://enzymejs.github.io/enzyme/)
for more information about using Enzyme, and the 
[jasmine-enzyme documenatation](https://github.com/FormidableLabs/enzyme-matchers/blob/master/packages/jasmine-enzyme/README.md)
for a list of available matchers.


### React Testing Library

Setup for react-testing-library is simple. All we need to do is make sure the
`@testing-library/react` package is installed. If you used a recent version of
`create-react-app` to initialize your application, it might already be there.
If not, install it:

<div class="yarn" markdown="1">
```shell
$ yarn add --dev @testing-library/react
```
</div>
<div class="npm" markdown="1">
```shell
$ npm install --save-dev @testing-library/react
```
</div>

See the
[React Testing Library documentation](https://testing-library.com/docs/react-testing-library/intro)
for more information. The related
[jasmine-dom](https://github.com/testing-library/jasmine-dom) matcher library
may also be of interest.

Note that most of the React Testing Library docs are written for Jest, so the
code samples require some translation before they'll work in Jasmine. In
particular:

* The Jasmine equivalent of `test()` is `it()`.
* Although there's a lot of overlap, Jest and Jasmine have different built-in
  matchers.
* Jest creates an implicit top-level suite in each file. Jasmine doesn't, so
  wrapping the contents of each file in a well-named `describe` is highly
  recommended.

When translating code samples from Jest to Jasmine, you may find it helpful to
refer to the [Jasmine tutorial](/tutorials/your_first_suite), the
[list of matchers that come with Jasmine](/api/edge/matchers.html), and the
[list of matchers that come with jasmine-dom](https://github.com/testing-library/jasmine-dom#custom-matchers).


## Wrapping up

You're all set. [Write your specs](/tutorials/your_first_suite.html) and run 
them:

<div class="yarn" markdown="1">
```shell
$ yarn test
```
</div>
<div class="npm" markdown="1">
```shell
$ npm test
```
</div>

<script>
	(function() {
		var buttons = document.querySelectorAll('input[name=mgr]');
		var root = document.getElementById('react-with-node-root');
		Array.prototype.forEach.call(buttons, function(btn) {
			btn.addEventListener('click', function() {
				root.classList.remove('npm-selected');
				root.classList.remove('yarn-selected');
				root.classList.add(btn.value + '-selected');
			});
		});
	}());
</script>

</div>
