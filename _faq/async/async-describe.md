---
question: Why can't I pass an async function to `describe`? How can I generate specs from asynchronously loaded data?
---

Synchronous functions can't call asynchronous functions, and `describe` has to
be synchronous because it's used in synchronous contexts like scripts loaded via
script tags. Making it async would break all existing code that uses Jasmine and
render Jasmine unusable in the environments where it's most popular.

However, if you use ES modules, you can fetch data asynchronously before calling
the top-level `describe`. Instead of this:

```javascript
// WARNING: does not work
describe('Something', async function() {
   const scenarios = await fetchSceanrios();
   
   for (const scenario of scenarios) {
       it(scenario.name, function() {
           // ...
       });
   }
});
```

Do this:

```javascript
const scenarios = await fetchSceanrios();

describe('Something', function() {
   for (const scenario of scenarios) {
       it(scenario.name, function() {
           // ...
       });
   }
});
```

To use top-level `await`, your spec files must be ES modules. If you are running
specs in a browser, you'll need to use `jasmine-browser-runner` 2.0.0 or
later and add `"enableTopLevelAwait": true` to the configuration file.