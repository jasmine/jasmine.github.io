/**
 * ## Custom Equality Testers
 */
describe("custom equality", function() {
  /**
   * You can customize how jasmine determines if two objects are equal by defining your own custom equality testers.
   * A custom equality tester is a function that takes two arguments.
   */
  var myCustomEquality = function(first, second) {
    /**
     * If the custom equality tester knows how to compare the two items, it should return either true or false
     */

    if (typeof first == "string" && typeof second == "string") {
      return first[0] == second[1];
    }

    /**
     * Otherwise, it should return undefined, to tell jasmine's equality tester that it can't compare the items
     */
  };

  /**
   * Then you register your tester in a `beforeEach` so jasmine knows about it.
   */
  beforeEach(function() {
    jasmine.addCustomEqualityTester(myCustomEquality);
  });

  /**
   * Then when you do comparisons in a spec, custom equality testers will be checked first before the default equality logic.
   */
  it("should be custom equal", function() {
    expect("abc").toEqual("aaa");
  });

  /**
   * If your custom tester returns false, no other equality checking will be done.
   */
  it("should be custom not equal", function() {
    expect("abc").not.toEqual("abc");
  });
});
