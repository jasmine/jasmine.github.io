---
layout: article
title: Node.js Setup
redirect_from: /edge/node.html
---

# Using Jasmine with Node

The `jasmine` module is a command line interface and supporting code for running
Jasmine specs under Node.js. Jasmine 4.x supports Node versions 12.17+, 14,
and 16. (Odd-numbered Node versions aren't supported, but many of them work.)

## Install

You can install Jasmine using npm locally in your project:

```sh
npm install --save-dev jasmine
```

With the above local installation you can invoke the CLI tool using `npx jasmine ...` commands.

Optionally you can also install jasmine globally so that you can invoke the
CLI tool without `npx`. This is not recommended, however, since it's difficult
to keep the globally installed `jasmine` version in sync with each project that
uses it.

```sh
npm install -g jasmine
```

## Init a Project

Initialize a project for Jasmine by creating a spec directory and configuration json for you:

```sh
npx jasmine init
```

## Generate examples

Generate example spec and source files:

```sh
npx jasmine examples
```

At this point you should be able to [write your first suite](/tutorials/your_first_suite.html).

## Configuration

Customize `spec/support/jasmine.json` to enumerate the source files and spec files you would like the
Jasmine runner to include. You may use dir glob strings.

Paths starting with `!` are excluded, for example `!**/*nospec.js`.

`spec_dir` is used as a prefix for all `spec_files` and `helpers`.
Helpers are executed before specs. For an example of some helpers see the [React tutorial](/tutorials/react_with_npm).

```javascript
{
  // Spec directory path relative to the current working dir when jasmine is executed.
  "spec_dir": "spec",

  // Array of filepaths (and globs) relative to spec_dir to include and exclude
  "spec_files": [
    "**/*[sS]pec.?(m)js",
    "!**/*nospec.js"
  ],

  // Array of filepaths (and globs) relative to spec_dir to include before jasmine specs
  "helpers": [
    "helpers/**/*.?(m)js"
  ],
  
  // Configuration of the Jasmine environment
  // "env" is optional, as are all of its properties.
  "env": {
    // Whether to fail a spec that ran no expectations
    "failSpecWithNoExpectations": false,
    
    // Stop execution of a spec after the first expectation failure in it
    "stopSpecOnExpectationFailure": false,

    // Stop execution of the suite after the first spec failure  
    "stopOnSpecFailure": false,

    // Run specs in semi-random order
    "random": false
  }
}
```

You can also specify a different config file by using either the `--config`
command line argument or the `JASMINE_CONFIG_PATH` environment variable, as
follows. Config files may be either `.json` or `.js`. A `.js` config file
should be a module whose default export is a configuration object.

```sh
jasmine JASMINE_CONFIG_PATH=relative/path/to/your/jasmine.json
jasmine --config=relative/path/to/your/jasmine.json
```

## Running Specs

Once you have set up your `jasmine.json`, you can execute all your specs by running `jasmine` from the root of your project (or `npx jasmine` if you had installed it locally).

If you want to just run one spec or only those in files that match a certain [glob](https://github.com/isaacs/node-glob) pattern you can do it like this:

```sh
npx jasmine spec/appSpec.js
npx jasmine "**/model/**/critical/**/*Spec.js"
```

# Filtering specs

Execute only those specs which filename match given glob:

```sh
npx jasmine "spec/**/critical/*Spec.js"
```

Or a single file:

```sh
npx jasmine spec/currentSpec.js
```

Or execute only those specs which name matches a particular regex:

```sh
npx jasmine --filter "adapter21*"
```

(where the *name* of a spec is the first parameter passed to `describe()`)


## Using ES Modules

Jasmine loads your code using dynamic import, which should be compatible with
both [ES modules](https://nodejs.org/docs/latest-v16.x/api/esm.html) and 
[CommonJS modules](https://nodejs.org/docs/latest-v16.x/api/modules.html). This
means that a script will be loaded as an ES module if its name ends in `.mjs` or
if the `package.json` of the package containing the file contains 
`"type": "module"`.

The default configuration should work fine for nearly all CommonJS projects as
well as those that use ES modules. But if necessary you can configure Jasmine
to load scripts using `require` by adding `"jsLoader": "require"` to your
Jasmine config file. If you have code that works with `"jsLoader": "require"`
but not without it, please [let us know](https://github.com/jasmine/jasmine-npm/issues).
Files with names ending in `.mjs` will be loaded via dynamic import even if
`jsLoader` is set to `"require"`.


### CLI Options

#### `JASMINE_CONFIG_PATH=`
Specify a relative or absolute path to your configuration file. Can be used as an option or set as an environment variable.

```sh
JASMINE_CONFIG_PATH=spec/config/jasmine.json jasmine

npx jasmine --config=spec/config/jasmine.json
```

#### `--no-color`
Turns off color in spec output

```sh
npx jasmine --no-color
```

#### `--filter=`
Only runs specs that match the given string

```sh
npx jasmine --filter="a spec name"
```

#### `--fail-fast=[true|false]`
Stops execution of the suite after the first expectation failure or other error when set to `true`

```sh
npx jasmine --fail-fast=true
```

#### `--random=[true|false]`
Tells jasmine to run specs in semi random order or not for this run, overriding `jasmine.json`

```sh
npx jasmine --random=true
```

#### `--seed=`
Sets the randomization seed if randomization is turned on

```sh
npx jasmine --seed=4321
```

#### `--reporter=`

Sets the default reporter. The value must be a valid 
[import specifier](https://nodejs.org/docs/latest-v16.x/api/esm.html#import-specifiers)
for a module whose default export is a reporter constructor.

```sh
npm i --save-dev jasmine-ts-console-reporter
npx jasmine --reporter=jasmine-ts-console-reporter
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

### Custom completion handler

By default, Jasmine will cause the Node process to exit once the suite finishes
running. The exit code will be 0 if the [overall status](https://jasmine.github.io/api/edge/global.html#JasmineDoneInfo)
of the suite is `'passed'` and nonzero in all other cases. If you want to handle
completion differently, you can set the Jasmine instance's `exitOnCompletion`
property to `false` and use the promise returned from `execute`. This is often 
used to message a status to task runners like grunt.

```javascript
jasmine.exitOnCompletion = false;
const result = await jasmine.execute();

if (result.overallStatus === 'passed') {
    console.log('All specs have passed');
} else {
    console.log('At least one spec has failed');
}
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

