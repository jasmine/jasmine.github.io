This example shows how to use import maps to mock modules in a web browser with
jasmine-browser-runner.

## Requirements
* The web browser must support ES module import maps.
* You are loading ES modules directly, not bundling them or transpiling to
  something else.

## Building and running

```shell
npm install
npm test
```

`npm test` assumes that Firefox and a matching version of GeckoDriver are 
installed. Alternately, run `npm run serve` and visit http://localhost:8888
in your browser of choice.

## Caveats

Module mocking with this approach is global: you can't use the real module in
some places and a mock in others. Unlike Node.js, browsers don't provide the
kind of configurable loaders that are needed to implement conditional module
mocking.

It's very important to replace all of the spies after each spec. Otherwise,
their state will leak from one spec to the next, causing specs to affect each
other's behavior. In this example, cleanup is done by the `afterEach(reset)`
call at the end of `mockModules/anOtherMod.mjs`.

## Tested with

* Firefox 114
* Safari 16.5 (will not work with versions before 16.3)
* Chrome 114
* jasmine-browser-runner 2.1.0
* jasmine-core 5.1.0