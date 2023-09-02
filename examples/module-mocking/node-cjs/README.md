This example shows how to mock native CommonJS modules in Node.js without any
additional tools.

See https://github.com/testdouble/testdouble.js/blob/main/docs/7-replacing-dependencies.md
for more information about this feature of TestDouble.

## Requirements
* You are using CommonJS modules, not ES modules.
* You are not using a bundler (e.g. Webpack).
* You are not using TypeScript.
  (There's [another recipe for that](../node-typescript-cjs/]).)

## Building and running

```shell
npm install
npm test
```

## Caveats

This recipe will not work if you destructure the imported properties of modules,
assign them to variables, or otherwise refer to them in any way other than as
properties of the module object.

Bundlers and transpilers may produce code that's incompatible with this recipe,
e.g. by making exported properties read-only.

## Tested with

* Node 18.0.0, 20.0.0, 20.3.0
* jasmine 5.1.0
* jasmine-core 5.1.0