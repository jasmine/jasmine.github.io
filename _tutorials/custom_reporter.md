---
layout: article
title: Custom Reporter
---

# Custom Reporters

If you don't like the way the built-in jasmine reporters look, you can always write your own.

## Create your reporter

A jasmine reporter is just an object with the right functions available.
None of the functions here are required when creating a custom reporter, any that are not specified on your reporter will just be ignored.

Additionally, in Jasmine 3.0, these functions can all be asynchronous in the same way as the callbacks in your suite.
Either by receiving a `done` callback, returning a `Promise`, or using the `async` keyword.
See the [async tutorial](/tutorials/async) for more information.

More details on the [Reporter interface](/api/edge/Reporter.html) can be found in the API docs

```javascript
const myReporter = {
  jasmineStarted: function(suiteInfo) {
    console.log('Running suite with ' + suiteInfo.totalSpecsDefined);
  },

  suiteStarted: function(result) {
    console.log('Suite started: ' + result.description
      + ' whose full description is: ' + result.fullName);
  },

  specStarted: async function(result) {
    await somethingAsync();
    console.log('Spec started: ' + result.description
      + ' whose full description is: ' + result.fullName);
  },

  specDone: function(result) {
    console.log('Spec: ' + result.description + ' was ' + result.status);

    for (const expectation of result.failedExpectations) {
      console.log('Failure: ' + expectation.message);
      console.log(expectation.stack);
    }

    console.log(result.passedExpectations.length);
  },

  suiteDone: function(result) {
    console.log('Suite: ' + result.description + ' was ' + result.status);
    for (const expectation of result.failedExpectations) {
      console.log('Suite ' + expectation.message);
      console.log(expectation.stack);
    }
  },

  jasmineDone: function(result) {
    console.log('Finished suite: ' + result.overallStatus);
    for (const expectation of result.failedExpectations) {
      console.log('Global ' + expectation.message);
      console.log(expectation.stack);
    }
  }
};
```

## Register the reporter with jasmine

```javascript
jasmine.getEnv().addReporter(myReporter);
```

## Additional notes

If you write a custom reporter, you should make sure it handles all of the failure modes Jasmine can report on.
__Note__: The way some of the failures are reported has changed in Jasmine 3.0

To help with this, we have a few example Jasmine suites that you can check your reporter against.
 
[Failure types](/examples/jasmine_failure_types.js) should have global failures that are reported to `jasmineDone`, suite level failures at `suiteDone` and spec level failures at `specDone`. Your reporter should display a total of 5 errors to the user.

[Exclusions](/examples/jasmine_exclusions.js) should report the non-`fdescribed` specs as having not been run. The reporter terminology for this has changed in Jasmine 3.0 and is now called `excluded` to more accurately represent the state of the suite.
