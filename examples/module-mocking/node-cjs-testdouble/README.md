This example shows how to use TestDouble to mock CommonJS modules in Node.js.
See https://github.com/testdouble/testdouble.js/blob/main/docs/7-replacing-dependencies.md
for more information about this feature of TestDouble.

## Requirements
* You are using CommonJS modules, not ES modules.
* You are not using a bundler (e.g. Webpack).

## Building and running

```shell
npm install
npm test
```

## Caveats

It's very important to call `td.reset()` after each spec. Otherwise, the state
of mocked modules will leak from one spec to the next, causing specs to affect 
each other's behavior.

## Tested with

* Node 18.0.0, 20.0.0, 20.3.0
* jasmine 5.1.0
* jasmine-core 5.1.0
* testdouble 3.18.0