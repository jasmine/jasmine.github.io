/**
 *
 * If you don't like the way the built-in jasmine reporters look, you can always write your own.
 *
 * More details on the [Reporter interface](/api/edge/Reporter.html) can be found in the API docs0
 */

/**
 * A jasmine reporter is just an object with the right functions available.
 * None of the functions here are required when creating a custom reporter, any that are not specified on your reporter will just be ignored.
 */
var myReporter = {
  /**
   * ### jasmineStarted
   *
   * `jasmineStarted` is called after all of the specs have been loaded, but just before execution starts.
   */
  jasmineStarted: function(suiteInfo) {
    /**
     * suiteInfo contains a property that tells how many specs have been defined
     */
    console.log('Running suite with '
      + suiteInfo.totalSpecsDefined);
  },
  /**
   * ### suiteStarted
   *
   * `suiteStarted` is invoked when a `describe` starts to run
   */
  suiteStarted: function(result) {
    /**
     * the result contains some meta data about the suite itself.
     */
    console.log('Suite started: '
      + result.description
      + ' whose full description is: '
      + result.fullName);
  },
  /**
   * ### specStarted
   *
   * `specStarted` is invoked when an `it` starts to run (including associated `beforeEach` functions)
   */
  specStarted: function(result) {
    /**
     * the result contains some meta data about the spec itself.
     */
    console.log('Spec started: '
      + result.description
      + ' whose full description is: '
      + result.fullName);
  },
  /**
   * ### specDone
   *
   * `specDone` is invoked when an `it` and its associated `beforeEach` and `afterEach` functions have been run.
   *
   * While jasmine doesn't require any specific functions, not defining a `specDone` will make it impossible for a reporter to know when a spec has failed.
   */
  specDone: function(result) {
    /**
     * The result here is the same object as in `specStarted` but with the addition of a status and lists of failed and passed expectations.
     */
    console.log('Spec: '
      + result.description
      + ' was '
      + result.status);

    for(var i = 0; i < result.failedExpectations.length; i++) {
      /**
       * Each `failedExpectation` has a message that describes the failure and a stack trace.
       */
      console.log('Failure: '
        + result.failedExpectations[i].message);
      console.log(result.failedExpectations[i].stack);
    }

    /**
     * The `passedExpectations` are provided mostly for aggregate information.
     */
    console.log(result.passedExpectations.length);
  },
  /**
   * ### suiteDone
   *
   * `suiteDone` is invoked when all of the child specs and suites for a given suite have been run
   *
   * While jasmine doesn't require any specific functions, not defining a `suiteDone` will make it impossible for a reporter to know when a suite has failures.
   */
  suiteDone: function(result) {
    /**
     * The result here is the same object as in `suiteStarted` but with the addition of a status and a list of failedExpectations.
     */
    console.log('Suite: '
      + result.description
      + ' was '
      + result.status);
    for(var i = 0; i < result.failedExpectations.length; i++) {
      /**
       * Each `failedExpectation` has a message that describes the failure and a stack trace.
       */
      console.log('Suite '
        + result.failedExpectations[i].message);
      console.log(result.failedExpectations[i].stack);
    }
  },
  /**
   * ### jasmineDone
   *
   * When the entire suite has finished execution `jasmineDone` is called
   *
   * While jasmine doesn't require any specific functions, not defining a `jasmineDone` will make it impossible for a reporter to know when there are global failures.
   */
  jasmineDone: function(result) {
    console.log('Finished suite: '
      + result.overallStatus);
    for(var i = 0; i < result.failedExpectations.length; i++) {
      /**
       * Each `failedExpectation` has a message that describes the failure and a stack trace.
       */
      console.log('Global '
        + result.failedExpectations[i].message);
      console.log(result.failedExpectations[i].stack);
    }
  }
};

/**
 * Register the reporter with jasmine
 */
jasmine.getEnv().addReporter(myReporter);

/**
 * If you write a custom reporter, you should make sure it handles all of the failure modes Jasmine can report on.
 * __Note__: The way some of the failures are reported has changed in Jasmine 3.0
 *
 * To help with this, we have a few example Jasmine suites that you can check your reporter against.
 R
 *
 * * [Failure types]({{ site.github_url }}/examples/jasmine_failure_types.js) should have global failures that are reported to `jasmineDone`, suite level failures at `suiteDone` and spec level failures at `specDone`. Your reporter should display a total of 5 errors to the user.
 * * [Exclusions]({{ site.github_url }}/examples/jasmine_exclusions.js) should report the non-`fdescribed` specs as having not been run. The reporter terminology for this has changed in Jasmine 3.0 and is now called `excluded` to more accurately represent the state of the suite.
 */
