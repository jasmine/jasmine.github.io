/**
 * ## Custom Equality Matchers
 * You can customize how jasmine determines if two objects are equal by defining your own custom equality matchers.
 * A custom equality matcher is a function that takes two arguments.
 */
var myCustomEquality = function(first, second) {
  /**
   * If the custom equality matcher knows how to compare the two items, it should return either true or false
   */

  if (typeof first == "string" && typeof second == "string") {
    return first[0] == second[1];
  }

  /**
   * Otherwise, it should return undefined, to tell jasmine's equality tester that it can't compare the items
   */
};

/**
 * Then you register your matcher so jasmine knows about it.
 */
beforeEach(function() {
  jasmine.addCustomEqualityTester(myCustomEquality);
});

/**
 * Then when you do comparisons in a spec, custom equality matchers will be checked first before the default equality logic.
 */
describe("with custom equality", function() {
  it("should be custom equal", function() {
    expect("abc").toEqual("aaa");
  });

  it("should be custom not equal", function() {
    expect("abc").not.toEqual("abc");
  });
});
