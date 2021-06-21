---
layout: article
title: Browser Setup
---

# Using Jasmine in the browser


The `jasmine-browser-runner` NPM module runs your Jasmine specs in a browser. 
It's suitable for interactive use with normal browsers as well as running specs 
in CI builds using either headless Chrome or Saucelabs.

## Getting started

```bash
npm install --save-dev jasmine-browser-runner
npx jasmine-browser-runner init
```

or

```bash
yarn add -D jasmine-browser-runner
npx jasmine-browser-runner init
```

Edit `spec/support/jasmine-browser.json` to customize the set of source files,
spec files, and helpers to be loaded. For example:

```json
{
  "srcDir": "src",
  "srcFiles": [
    "**/*.?(m)js"
  ],
  "specDir": "spec",
  "specFiles": [
    "**/*[Ss]pec.?(m)js"
  ],
  "helpers": [
    "helpers/asyncAwait.js"
  ],
  "random": true
}
```

You can also use the `--config` option to specify a different file. This file 
can be a JSON file or a javascript file that exports a object that looks like 
the JSON above.

## Running specs interactively

Start the server:

```
npx jasmine-browser-runner serve
```

Then visit [http://localhost:888/](http://localhost:888/) in the browser of your
choice.

## Run the tests on the command line

```
npx jasmine-browser-runner runSpecs
```

The specs will be run in a browser (Firefox by default). Once the run is
finished, `jasmine-browser-runner` will exit 0 if everything passed and nonzero
if any specs failed or were filtered out.

To use a browser other than Firefox, add a `browser` field to 
`jasmine-browser.json`:

```javascript
{
  // ...
  "browser": "chrome"
}
```

Its value can be `"internet explorer"`, `"firefox"`, `"safari"`, 
`"MicrosoftEdge"`, `"chrome"`, or `"headlessChrome"`.

## ES module support

If a source, spec, or helper file's name ends in `.mjs`, it will be loaded as
an ES module rather than a regular script. Note that ES modules are not 
available in all browsers supported by jasmine-browser. Currently, 
jasmine-browser does not try to determine whether the browser supports ES
modules. ES modules will silently fail to load in browsers that don't
support them. Other kinds of load-time errors are detected and reported as suite
errors.

## Saucelabs support

jasmine-browser can run your Jasmine specs on [Saucelabs](https://saucelabs.com/).
To use Saucelabs, set `browser.name`, `browser.useSauce`, and `browser.sauce`
in your config file as follows:

```javascript
{
  // ...
  "browser": {
    "name": "safari",
    "useSauce": true,
    "sauce": {
      "browserVersion": "13",
      "os": "OS X 10.15",
      "tags": ["your tag", "your other tag"],
      "tunnelIdentifier": "tunnel ID",
      "username": "your Saucelabs username",
      "accessKey": "your Saucelabs access key"
    }
  }
}
```

All properties of `browser.sauce` are optional except for `username` and 
`accessKey`. It's best to omit `browser.sauce.os` unless you need to run on a 
specific operating system. Setting `browser.sauce.tunnelIdentifier` is strongly
recommended unless you're sure that your account will never have more than one
active tunnel.

## Want more control?

```javascript
var path = require('path'),
  jasmineBrowser = require('jasmine-browser-runner'),
  jasmineCore = require('../../lib/jasmine-core.js');

var config = require(path.resolve('spec/support/jasmine-browser.json'));
config.projectBaseDir = path.resolve('some/path');

jasmineBrowser.startServer(config, { port: 4321 });
```



