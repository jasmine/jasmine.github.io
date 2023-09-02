This example shows how to use TestDouble to do module mocking in TypeScript,
when TypeScript is configured to output ES modules. See 
https://github.com/testdouble/testdouble.js/blob/main/docs/7-replacing-dependencies.md
for more information about this feature of TestDouble.

## Requirements
* TypeScript is configured to output ES modules, not CommonJS. See the
  [node-typescript-cjs example](../node-typescript-cjs/) for how to handle
  CommonJS output, even if the source files use `import` and `export`.
* The output ES modules are loaded directly by Node. They are not bundled by
  e.g. Webpack.

## Building and running

```shell
npm install
npm run build
npm test
```

## Caveats

Node must be invoked with `--loader=testdouble` to enable the TestDouble ESM
loader. See the `test` script in `package.json`. The Jasmine config file must be
JavaScript, not JSON. In this example `build/spec/support/jasmine.js` is built
from `spec/support/jasmine.ts`.

TestDouble relies on the Node ES module loader interface, which is still marked
experimental as of Node 20.3.0. Future versions of Node are likely to make 
breaking changes which will require updates to TestDouble.

It's very important to call `td.reset()` after each spec. Otherwise, the state
of mocked modules will leak from one spec to the next, causing specs to affect
each other's behavior.

Node will output one or more warnings about the use of experimental ESM loaders.
If you want, you can suppress warnings by setting the `NODE_NO_WARNINGS`
environment variable to 1 or adding `--no-warnings` to the Node command line.
Note that this will suppress all warnings, not just ones about the use of
experimental ESM loaders

## Tested with

* Node 18.0.0, 20.0.0, 20.3.0
* jasmine 5.1.0
* jasmine-core 5.1.0
* typescript 5.0.4