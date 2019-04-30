/**
 *
 * Jasmine provides a number of asymmetric matchers out of the box for use in comparing argument values and equality.
 * If you want to make your own to encapsulate some other logic you can.
 *
 */

/**
 * Creator function similar to `jasmine.any()`
 */
function myChecker(someState) {
  return {
    /**
     * This is called by Jasmine's equality function with the object being compared.
     */
    asymmetricMatch: function(compareTo) {
      return compareTo.myState === someState;
    },
    /**
     * Custom stringification for Jasmine pretty printer. Used in failure messages.
     */
    jasmineToString: function() {
      return '<myChecker: ' + someState '>';
    }
  }
}

/**
 * You can then use it in an expectation
 */
expect(mySpy).toHaveBeenCalledWith(myChecker('stuff'));
expect({myState: 'things'}).toEqual(myChecker('things'));

