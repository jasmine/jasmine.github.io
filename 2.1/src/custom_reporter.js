/**
 *
 * If you don't like the way the built-in jasmine reporters look, you can always write your own.
 *
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
    console.log('Running suite with ' + suiteInfo.totalSpecsDefined);
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
    console.log('Suite started: ' + result.description + ' whose full description is: ' + result.fullName);
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
    console.log('Spec started: ' + result.description + ' whose full description is: ' + result.fullName);
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
     * The result here is the same object as in `specStarted` but with the addition of a status and a list of failedExpectations.
     */
    console.log('Spec: ' + result.description + ' was ' + result.status);
    for(var i = 0; i < result.failedExpectations.length; i++) {
      /**
       * Each `failedExpectation` has a message that describes the failure and a stack trace.
       */
      console.log('Failure: ' + result.failedExpectations[i].message);
      console.log(result.failedExpectations[i].stack);
    }
  },
  /**
   * ### suiteDone
   *
   * `suiteDone` is invoked when all of the child specs and suites for a given suite have been run
   *
   * While jasmine doesn't require any specific functions, not defining a `suiteDone` will make it impossible for a reporter to know when a suite has failures in an `afterAll`.
   */
  suiteDone: function(result) {
    /**
     * The result here is the same object as in `suiteStarted` but with the addition of a status and a list of failedExpectations.
     */
    console.log('Suite: ' + result.description + ' was ' + result.status);
    for(var i = 0; i < result.failedExpectations.length; i++) {
      /**
       * Any `failedExpectation`s on the suite itself are the result of a failure in an `afterAll`.
       * Each `failedExpectation` has a message that describes the failure and a stack trace.
       */
      console.log('AfterAll ' + result.failedExpectations[i].message);
      console.log(result.failedExpectations[i].stack);
    }
  },
  /**
   * ### jasmineDone
   *
   * When the entire suite has finished execution `jasmineDone` is called
   */
  jasmineDone: function() {
    console.log('Finished suite');
  }
};

/**
 * Register the reporter with jasmine
 */
jasmine.getEnv().addReporter(myReporter);

/**
 * If you look at the console output for this page, you should see the output from this reporter
 */
describe('Top Level suite', function() {
  it('spec', function() {
    expect(1).toBe(1);
  });

  describe('Nested suite', function() {
    it('nested spec', function() {
      expect(true).toBe(true);
    });
  });
});
