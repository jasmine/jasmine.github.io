/**
 * ##Custom Matchers
 */
describe("custom matchers", function () {
  /**
   * To register a matcher, call `addMatchers` in a `beforeEach`.
   */
  beforeEach(function() {
    addMatchers({
      /**
       * You can include multiple matchers in this object.
       * The keys will be used as the matcher name.
       * The factory method will receive the jasmine `matchersUtil` and any `customEqualityTesters` that have been registered.
       */
      toBeGoofy: function(util, customEqualityTesters) {
        /**
         * The factory method should return an object with a `compare` function that will be called to check the expectation.
         */
        return {
          /**
           * The compare function receives the value passed to `expect()` as the first argument,
           * and the value (if any) passed to the matcher itself as second argument.
           */
          compare: function(actual, expected) {
            if (expected === undefined) {
              expected = '';
            }

            var result = {};

            /**
             * The `pass` attribute tells the expectation whether your matcher matched.
             * If the used with `.not`, the expectation will negate this to determine whether the expectation is met.
             */
            result.pass = util.equals(actual.hyuk, "gawrsh" + expected, customEqualityTesters);

            /**
             * You can also include a custom failure message if the automatically determined ones are not descriptive enough.
             */
            if (result.pass) {
              /**
               * The matcher succeeded, so return the error message as if the user used `.not`
               */
              result.message = "Expected " + actual + " not to be quite so goofy";
            } else {
              /**
               * The matcher failed, so return the error message as if the user did not use `.not`
               */
              result.message = "Expected " + actual + " to be goofy, but it was not very goofy";
            }

            return result;
          }
        };
      }
    });
  });

  /**
   * Once the matcher is registered with jasmine, you can use it exactly as you would any of the build in matchers.
   */
  it("should use custom matchers", function() {
    expect({hyuk: 'gawrsh' }).toBeGoofy();
  });

  it("should use custom matchers with parameters", function() {
    expect({hyuk: 'gawrsh is fun' }).toBeGoofy(' is fun');
  });

  it("should negate custom matchers", function() {
    expect({hyuk: 'this is fun' }).not.toBeGoofy();
  });
});
