---
layout: article
title: Node.js Setup
redirect_from: /edge/node.html
---

# Using Jasmine with node

The Jasmine node package contains helper code for developing and running Jasmine tests for node-based projects. Jasmine 3.x supports Node versions 10, 12, 14, and 16. (Odd-numbered Node versions aren't supported, but will probably work.)

## Install

You can install Jasmine using npm locally in your project:

```sh
npm install --save-dev jasmine
```

With the above local installation you can invoke the CLI tool using `npx jasmine ...` commands.

Optionally you can also install jasmine globally so that you can invoke the CLI tool using `jasmine ...` commands.

```sh
npm install -g jasmine
```

## Init a Project

Initialize a project for Jasmine by creating a spec directory and configuration json for you.

```sh
jasmine init
```

Note that if you installed Jasmine locally use `npx jasmine` instead of `jasmine` in any of these examples, like so:

```sh
npx jasmine init
```

## Generate examples

Generate example spec and source files

```sh
jasmine examples
```

At this point you should be able to [write your first suite](/tutorials/your_first_suite.html)

## Configuration

Customize `spec/support/jasmine.json` to enumerate the source files and spec files you would like the
Jasmine runner to include. You may use dir glob strings.

Paths starting with `!` are excluded, for example `!**/*nospec.js`.

`spec_dir` is used as a prefix for all `spec_files` and `helpers`.
Helpers are executed before specs. For an example of some helpers see the [react tutorial](/tutorials/react_with_npm)

```javascript
{
  // Spec directory path relative to the current working dir when jasmine is executed.
  "spec_dir": "spec",

  // Array of filepaths (and globs) relative to spec_dir to include and exclude
  "spec_files": [
    "**/*[sS]pec.js",
    "!**/*nospec.js"
  ],

  // Array of filepaths (and globs) relative to spec_dir to include before jasmine specs
  "helpers": [
    "helpers/**/*.js"
  ],

  // Whether to fail a spec that ran no expectations
  "failSpecWithNoExpectations": false,

  // Stop execution of a spec after the first expectation failure in it
  "stopSpecOnExpectationFailure": false,

  // Stop execution of the suite after the first spec failure  
  "stopOnSpecFailure": false,

  // Run specs in semi-random order
  "random": false
}
```

## Running tests

Once you have set up your `jasmine.json`, you can execute all your specs by running `jasmine` from the root of your project (or `npx jasmine` if you had installed it locally).

If you want to just run one spec or only those whom file names match a certain [glob](https://github.com/isaacs/node-glob) pattern you can do it like this:

```sh
jasmine spec/appSpec.js
jasmine "**/model/**/critical/**/*Spec.js"
```

## Using ES modules

If the name of a spec file or helper file ends in `.mjs`, Jasmine will load it
as an [ES module](https://nodejs.org/docs/latest-v13.x/api/esm.html) rather 
than a CommonJS module. This allows the spec file or helper to import other 
ES modules. No extra configuration is required. Note that Jasmine does not 
currently take advantage of the `type` field in `package.json`, so spec and 
helper files ending in `.js` will be loaded as CommonJS modules even if 
`"type": "module"` is set in `package.json`.

### CLI Options

#### `JASMINE_CONFIG_PATH=`
Specify a relative or absolute path to your configuration file. Can be used as an option or set as an environment variable.

```sh
JASMINE_CONFIG_PATH=spec/config/jasmine.json jasmine

jasmine --config=spec/config/jasmine.json
```

#### `--no-color`
Turns off color in spec output

```sh
jasmine --no-color
```

#### `--filter=`
Only runs specs that match the given string

```sh
jasmine --filter="a spec name"
```

#### `--stop-on-failure=[true|false]`
 Stops execution of a spec after the first expectation failure when set to `true`

```sh
jasmine --stop-on-failure=true
```

#### `--random=[true|false]`
Tells jasmine to run specs in semi random order or not for this run, overriding `jasmine.json`

```sh
jasmine --random=true
```

#### `--seed=`
Sets the randomization seed if randomization is turned on

```sh
jasmine --seed=4321
```

#### `--reporter=`

Sets the reporter default reporter implementation. Must be a valid node.js module name and needs installed in your project. If Jasmine-npm cannot load it it will use the default one.

```sh
npm i --save-dev jasmine-ts-console-reporter
jasmine --reporter=jasmine-ts-console-reporter
```


## Using the library

If you want more granular control over the configuration, Jasmine can also be used as a library in your project.
This allows you to load multiple config files or control your configuration in different ways.

```javascript
var Jasmine = require('jasmine');
var jasmine = new Jasmine();
```

### Load configuration from a file or from an object

```javascript
jasmine.loadConfigFile('spec/support/jasmine.json');

jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
        'appSpec.js',
        'requests/**/*[sS]pec.js',
        'utils/**/*[sS]pec.js'
    ],
    helpers: [
        'helpers/**/*.js'
    ]
});
```

### Custom onComplete

Optionally specify a custom `onComplete` callback. The callback is given a boolean of whether all of the specs passed or not. This is often used to message a status to task runners like grunt.

```javascript
jasmine.onComplete(function(passed) {
    if(passed) {
        console.log('All specs have passed');
    }
    else {
        console.log('At least one spec has failed');
    }
});
```

### Reporters

A ConsoleReporter is included if no other reporters are added.
You can configure the default reporter with `configureDefaultReporter`.
The default values are shown in the example.

```javascript
jasmine.configureDefaultReporter({
    // The `timer` passed to the reporter will determine the mechanism for seeing how long the suite takes to run.
    timer: new jasmine.jasmine.Timer(),
    // The `print` function passed the reporter will be called to print its results.
    print: function() {
        process.stdout.write(arguments);
    },
    // `showColors` determines whether or not the reporter should use ANSI color codes.
    showColors: true
});
```

You can add a custom reporter with `addReporter`. If you add a reporter through `addReporter`, the default ConsoleReporter will not be added.
Multiple reporters can be added.

```javascript
var CustomReporter = require('./myCustomReporter');
var customReporter = new CustomReporter();

jasmine.addReporter(customReporter);
```

### Run the tests

Calling `execute` will run the specs.

```javascript
jasmine.execute();
```

`execute` can optionally be called with a list of spec file paths to execute relative to your project root and a string to filter by spec name.

```javascript
jasmine.execute(['fooSpec.js'], 'a spec name');
```

### A simple example using the library

```javascript
var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.configureDefaultReporter({
    showColors: false
});
jasmine.execute();
```

