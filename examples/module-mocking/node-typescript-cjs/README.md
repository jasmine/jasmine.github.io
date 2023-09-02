This example shows how to do module mocking in TypeScript without any 
additional tools, when TypeScript is configured to output CommonJS modules.

## Requirements
* TypeScript is configured to output CommonJS modules, not ES modules. See the
  [node-typescript-esm-testdouble example](../node-typescript-esm-testdouble/)
  for how to handle ES module output.
* The output modules are loaded directly by Node. They are not bundled by
  e.g. Webpack.


## Building and running

```shell
npm install
npm run build
npm test
```

## Caveats

This approach depends on TypeScript compiling this code:

```javascript
import {theString} from './anotherModule';

export function quote() {
    return '"' + theString() + '"';
}
```

to something like this:

```javascript
const anotherModule_1 = require("./anotherModule");
function quote() {
    return '"' + (0, anotherModule_1.theString)() + '"';
}
// ...
```

Without the indirection through `anotherModule_1`, it's impossible for the code
in the spec file to affect the call to `theString()` inside `quote()`. If a
future version of TypeScript removes that indirection, this example will stop
working.

Some older versions of TypeScript, particularly 3.9, mark exported module
properties read-only. This approach does not work with those TypeScript
versions.

## Tested with

* Node 18.0.0, 20.0.0, 20.3.0
* jasmine 5.1.0
* jasmine-core 5.1.0
* typescript 5.0.4