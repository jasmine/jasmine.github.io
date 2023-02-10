---
layout: article
title: Testing a React app in browsers with Jasmine
---

<style>
	#react-with-browser-root.npm-selected .yarn { display: none; }
	#react-with-browser-root.yarn-selected .npm { display: none; }
</style>

<div id="react-with-browser-root" class="npm-selected" markdown="1">

This tutorial will explain how to set up [jasmine-browser-runner](/setup/browser.html)
to test React applications in web browsers. You can follow a similar process to
test other kinds of applications that are built with Webpack and Babel.

Prerequisites:
* Your application already builds and runs.
* You have Node 14 or newer.
* You're comfortable editing Webpack config files, or at least willing to give
  it a try.
* If you want to run your specs in Firefox, a version of
  [geckodriver](https://github.com/mozilla/geckodriver/releases) that's
  compatible with your version of Firefox is installed somewhere on `$PATH`.
* If you want to run your specs in Chrome, a version of
  [chromedriver](https://chromedriver.chromium.org/downloads) that's
  compatible with your version of Chrome is installed somewhere on `$PATH`.

If you used create-react-app to set up your application, you don't have to
eject. However, it can help to eject in a separate copy of your application
so that you can see how create-react-app configures Webpack and Babel.

Choose the package managment tool you'll be using:

<label>
	<input type="radio" name="mgr" value="npm" checked>
	npm (the default for create-react-app)
</label><br>
<label>
	<input type="radio" name="mgr" value="yarn">
	yarn
</label>

## Adding dependencies

Install these packages if you haven't already:

<div class="yarn" markdown="1">
```shell
$ yarn add --dev jasmine-core jasmine-browser-runner 
```
</div>
<div class="npm" markdown="1">
```shell
$ npm install --save-dev jasmine-core jasmine-browser-runner
```
</div>

If you used create-react-app to set up your application, you may also need to
add the following dependencies:

* `cross-env`
* The version of `webpack-cli` that corresponds to the version of `webpack`
  that's installed
* The same version of `babel-loader` that `react-scripts` depends on.

You can find out the versions of installed packages with the `npm ls` command,
e.g. `npm ls webpack`. (This works even if you're using Yarn to install
packages.)


## Configuring Webpack

Next, create a new Webpack configuration file `webpack-test.config.js` for your
specs. This should be similar to the one that packages the JavaScript code for
your application. Set the output filename to `test.js` and the entry to the
list of spec files. (Tip: use `glob` so you don't have to manually update the
list as you add and remove files.) 

For instance, suppose that your main Webpack configuration file looks like this:

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.[hash].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png|svg|jpg|gif$/,
        use: ["file-loader"],
      }, 
    ],
  },
};
```

A corresponding `webpack-test.config.js` might look like this:

```javascript
const path = require("path");
const glob = require("glob");

module.exports = {
  entry: glob.sync("spec/**/*Spec.js?(x)"),
  output: {
    filename: "test.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [],
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png|svg|jpg|gif$/,
        use: ["file-loader"],
      }, 
    ],
  },
};
```

The differences between them are as follows:

```diff
-const HtmlWebpackPlugin = require("html-webpack-plugin");
 const path = require("path");
+const glob = require("glob");
 
 module.exports = {
-  entry: "./src/index.js",
+  entry: glob.sync("spec/**/*Spec.js?(x)"),
   output: {
-    filename: "bundle.[hash].js",
+    filename: "test.js",
     path: path.resolve(__dirname, "dist"),
   },
-  plugins: [
-    new HtmlWebpackPlugin({
-      template: "./src/index.html",
-    }),
-  ],
+  plugins: [],
   resolve: {
     modules: [__dirname, "src", "node_modules"],
     extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
```

The above example assumes that your spec files will be stored in the `spec`
directory and have names that end in `Spec.js`. You'll need to change the glob
pattern if you want to put the spec files somewhere else. For instance, many
React developers put the spec files next to the code that they test and give
them names ending in `.test.js`. To match those files, use `src/**/*.test.js`
instead of `spec/**/*Spec.js(x)`.

### Dealing with React imports

Some React codebases have a statment like `import React from 'react'` near
the start of every file that contains JSX expressions. Others use a Webpack
plugin to automatically add that at compile time. Check your component source
files. If they don't have an import statement like the one above, you'll need
to make sure that `webpack-test.config.ts` contains something like this:

```diff
         test: /\.jsx?$/,
         exclude: /node_modules/,
         loader: require.resolve("babel-loader"),
+        options: {
+          customize: require.resolve('babel-preset-react-app/webpack-overrides'),
+          presets: [
+            [
+              require.resolve('babel-preset-react-app'),
+              { runtime: 'automatic' }
+            ],
+          ],
+        },
       },
       {
         test: /\.css$/,
```

Otherwise, errors like `ReferenceError: React is not defined` will be thrown
from component source files when you run the specs.

## Configuring Babel

If you don't already have a
[Babel configuration](https://babeljs.io/docs/en/configuration), create one
with the following contents:

```json
{
  "presets": [
    "@babel/preset-react",
    "@babel/preset-env"
  ]
}
```

This is usually only necessary if you used create-react-app.


## Configuring jasmine-browser-runner

Next, create `spec/support/jasmine-browser.json` with the following contents:

```json
{
  "srcDir": "src",
  "srcFiles": [],
  "specDir": "dist",
  "specFiles": ["test.js"],
  "helpers": [],
  "browser": {
    "name": "firefox"
  }
}
```

The values of `specDir` and `specFiles` need to correspond to the output path
from the WebPack configuration, in this case `dist/test.js`.

If you don't want to use Firefox, change the browser name to `chrome`, `safari`,
or `MicrosoftEdge`.

Now, add the following to the `scripts` section of `package.json`:


```json
    "test:build": "cross-env NODE_ENV=test npx webpack --config webpack-test.config.js --mode development",
    "test:watch": "cross-env NODE_ENV=test npx webpack --config webpack-test.config.js --mode development --watch",
    "test": "npm run test:build && jasmine-browser-runner runSpecs",
    "test:serve": "npm run test:build && jasmine-browser-runner"
```

### React Testing Library

React Testing Library is currently the most popular choice for rendering React
components in specs and querying the result. Unlike some of the alternatives,
it can run in the browser. Setup is simple. All you need to do is make sure the
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

You're all set. [Write your specs](/tutorials/your_first_suite.html) using
spec filenames that match the Webpack configuration you created earlier, and
run them. There are a few different ways to run the specs:


To run the specs once, just run <span class="yarn" markdown="1">`yarn test`</span>
<span class="npm" markdown="1">`npm test`</span>. This will compile the specs
by running `test:build`, launch a browser, run the specs in it, and shut down
the browser. The exit code will be 0 if everything passes and nonzero otherwise.

To start a server that will let you run the specs by visiting a web page, run
<span class="yarn" markdown="1">`yarn test:serve`</span>
<span class="npm" markdown="1">`npm run test:serve`</span>. This is
particularly useful for debugging. You may also want to keep 
<span class="yarn" markdown="1">`yarn test:watch`</span>
<span class="npm" markdown="1">`npm run test:watch`</span> running to
automatically recompile your code as you make changes.

If you'd rather have <span class="yarn" markdown="1">`yarn test`</span>
<span class="npm" markdown="1">`npm test`</span> use a headless browser,
add `--browser=headlessChrome` to the end of the `test` script in
`package.json`:

```json
    "test": "npm run test:build && jasmine-browser-runner runSpecs --browser=headlessChrome",
```

<script>
  (function() {
    const buttons = document.querySelectorAll('input[name=mgr]');
    const root = document.getElementById('react-with-browser-root');

    for (const btn of buttons) {
      btn.addEventListener('click', function() {
        root.classList.remove('npm-selected');
        root.classList.remove('yarn-selected');
        root.classList.add(btn.value + '-selected');
      });
    }
  }());
</script>

</div>
