/**
 ## Suites: `describe` Your Tests
 The [describe](/api/edge/global.html#describe) function is for grouping
 related specs, typically each test file has one at the top level.
 The string parameter is for naming the collection of specs, and will be
 concatenated with specs to make a spec&#x27;s full name. This aids in finding
 specs in a large suite. If you name them well, your specs read as full
 sentences in traditional [BDD](http://en.wikipedia.org/wiki/Behavior-driven_development)
 style.

 ## Specs
 Specs are defined by calling the global Jasmine function
 [it](/api/edge/global.html#it), which, like `describe` takes a string and a
 function. The string is the title of the spec and the function is the spec, or
 test. A spec contains one or more expectations that test the state of the code.
 An expectation in Jasmine is an assertion that is either true or false. A spec
 with all true expectations is a passing spec. A spec with one or more false
 expectations is a failing spec.
 */
describe("A suite", function() {
    it("contains a spec with an expectation", function() {
        expect(true).toBe(true);
    });
});

/**
 ### It&#x27;s Just Functions
 Since `describe` and `it` blocks are functions, they can contain any
 executable code necessary to implement the test. JavaScript scoping rules
 apply, so variables declared in a `describe` are available to any `it` block
 inside the suite.
 */
describe("A suite is just a function", function() {
    let a;

    it("and so is a spec", function() {
        a = true;

        expect(a).toBe(true);
    });
});

/**
 ## Expectations
 Expectations are built with the function `expect` which takes a value, called
 the actual. It is chained with a Matcher function, which takes the expected
 value.
 */
describe("The 'toBe' matcher compares with ===", function() {
    /**
     ### Matchers
     Each matcher implements a boolean comparison between the actual value and
     the expected value. It is responsible for reporting to Jasmine if the
     expectation is true or false. Jasmine will then pass or fail the spec.
     */
    it("and has a positive case", function() {
        expect(true).toBe(true);
    });

    /**
     Any matcher can evaluate to a negative assertion by chaining the call to
     `expect` with a `not` before calling the matcher.
     */
    it("and can have a negative case", function() {
        expect(false).not.toBe(true);
    });

    /**
     Jasmine has a rich set of matchers included, you can find the full list in
     the [API docs](/api/edge/matchers.html) There is also the ability to write
     [custom matchers](custom_matcher.html) for when a project&#x27;s domain
     calls for specific assertions that are not included in Jasmine.
     */
});

/**
 ### Setup and Teardown
 To help a test suite DRY up any duplicated setup and teardown code, Jasmine
 provides the global [beforeEach](/api/edge/global.html#beforeEach),
 [afterEach](/api/edge/global.html#afterEach),
 [beforeAll](/api/edge/global.html#beforeAll), and
 [afterAll](/api/edge/global.html#afterAll) functions.
 */
describe("A suite with some shared setup", function() {
    let foo = 0;

    /**
    As the name implies, the `beforeEach` function is called once before each spec in the `describe` in which it is called
    */
    beforeEach(function() {
        foo += 1;
    });

    /**
     and the `afterEach` function is called once after each spec.
     */
    afterEach(function() {
        foo = 0;
    });

    /**
     The `beforeAll` function is called only once before all the specs in describe are run,
     */
    beforeAll(function() {
        foo = 1;
    });

    /**
     and the `afterAll` function is called after all specs finish.
     */
    afterAll(function() {
        foo = 0;
    });

    /**
     `beforeAll` and `afterAll` can be used to speed up test suites with
     expensive setup and teardown.

     However, be careful using `beforeAll` and `afterAll`! Since they are not
     reset between specs, it is easy to accidentally leak state between your
     specs so that they erroneously pass or fail.
     */

    /**
     ### The `this` keyword
     Another way to share variables between a `beforeEach`, `it`, and
     `afterEach` is through the `this` keyword. Each spec's
     `beforeEach`/`it`/`afterEach` has the `this` as the same empty object that
     is set back to empty for the next spec's `beforeEach`/`it`/`afterEach`.

     Note: If you want to use the `this` keyword to share variables, you must
     use the `function` keyword and not arrow functions.
     */
    describe("A spec", function() {
        beforeEach(function() {
            this.foo = 0;
        });

        it("can use the `this` to share state", function() {
            expect(this.foo).toEqual(0);
            this.bar = "test pollution?";
        });

        it("prevents test pollution by having an empty `this` " +
            "created for the next spec", function() {
            expect(this.foo).toEqual(0);
            expect(this.bar).toBe(undefined);
        });
    });

    /**
     ### Manually failing a spec with fail

     The fail function causes a spec to fail. It can take a failure message or
     an Error object as a parameter.
     */
    describe("A spec using the fail function", function() {
        function foo(x, callBack) {
            if (x) {
                callBack();
            }
        }

        it("should not call the callBack", function() {
            foo(false, function() {
                fail("Callback has been called");
            });
        });
    });

    /**
     ### Nesting `describe` Blocks

     Calls to `describe` can be nested, with specs defined at any level. This
     allows a suite to be composed as a tree of functions. Before a spec is
     executed, Jasmine walks down the tree executing each `beforeEach` function
     in order. After the spec is executed, Jasmine walks through the
     `afterEach` functions similarly.
     */
    describe("A spec", function() {
        let foo;

        beforeEach(function() {
            foo = 0;
            foo += 1;
        });

        afterEach(function() {
            foo = 0;
        });

        it("is just a function, so it can contain any code", function() {
            expect(foo).toEqual(1);
        });

        it("can have more than one expectation", function() {
            expect(foo).toEqual(1);
            expect(true).toEqual(true);
        });

        describe("nested inside a second describe", function() {
            let bar;

            beforeEach(function() {
                bar = 1;
            });

            it("can reference both scopes as needed", function() {
                expect(foo).toEqual(bar);
            });
        });
    });

    /**
     ### Disabling Suites

     Suites can be disabled with the `xdescribe` function. These suites and any
     specs inside them are skipped when run and thus their results will show as
     pending.

     Suites can also be focused with the `fdescribe` function. That means only
     `fdescribe` suits will run.
     */
    xdescribe("A spec", function() {
        let foo;

        beforeEach(function() {
            foo = 0;
            foo += 1;
        });

        it("is just a function, so it can contain any code", function() {
            expect(foo).toEqual(1);
        });
    });

    /**
     ### Pending Specs

     Pending specs do not run, but their names will show up in the results as
     pending.
     */
    describe("Pending specs", function() {
        /**
         Any spec declared with `xit` is marked as pending.
         */
        xit("can be declared 'xit'", function() {
            expect(true).toBe(false);
        });

        /**
         Any spec declared without a function body will also be marked pending
         in results.
         */
        it("can be declared with 'it' but without a function");

        /**
         And if you call the function `pending` anywhere in the spec body,
         no matter the expectations, the spec will be marked pending. A string
         passed to `pending` will be treated as a reason and displayed when the
         suite finishes.
         */
        it("can be declared by calling 'pending' in the spec body", function() {
            expect(true).toBe(false);
            pending('this is why it is pending');
        });
    });
});

/**
 Tests can also be focused with the `fit` function. That means only `fit` tests
 will run.
 */


/**
 ## Asynchronous Support

 Jasmine also has support for running specs that require testing
 asynchronous operations. The functions that you pass to `beforeAll`,
 `afterAll`, `beforeEach`, `afterEach`, and `it` can be declared async.

 Jasmine also supports asynchronous functions that explicitly return
 promises or that take a callback. See the
 [Asynchronous Work tutorial](/tutorials/async) for more information.
 */
describe("Using async/await", function () {
    beforeEach(async function () {
        await soon();
        value = 0;
    });

    /**
     This spec will not start until the promise returned from the call to
     `beforeEach` above is settled. And this spec will not complete until
     the promise that it returns is settled.
     */
    it("supports async execution of test preparation and expectations",
        async function () {
            await soon();
            value++;
            expect(value).toBeGreaterThan(0);
        }
    );

    function soon() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, 1);
        });
    }
});


/**
 By default jasmine will wait for 5 seconds for an asynchronous spec to
 finish before causing a timeout failure. If the timeout expires before
 `done` is called, the current spec will be marked as failed and suite
 execution will continue as if `done` was called.

 If specific specs should fail faster or need more time this can be
 adjusted by passing a timeout value to `it`, etc.

 If the entire suite should have a different timeout,
 `jasmine.DEFAULT_TIMEOUT_INTERVAL` can be set globally, outside of any
 given describe.
 */
describe("long asynchronous specs", function() {
    beforeEach(async function() {
        await somethingSlow();
    }, 1000);

    it("takes a long time", async function() {
        await somethingReallySlow();
    }, 10000);

    afterEach(async function() {
        await somethingSlow();
    }, 1000);
});

/**
 ## Spies

 Jasmine has test double functions called [spies](/api/edge/Spy.html). A spy
 can stub any function and tracks calls to it and all arguments. A spy only
 exists in the `describe` or `it` block in which it is defined, and will be
 removed after each spec. There are special matchers for interacting with spies.
 */
describe("A spy", function() {
    let foo;
    let bar = null;

    beforeEach(function() {
        foo = {
            setBar: function (value) {
                bar = value;
            }
        };

        /**
         You can define what the spy will do when invoked with
         [and](/api/edge/Spy.html#and).
         */
        spyOn(foo, 'setBar');

        foo.setBar(123);
        foo.setBar(456, 'another param');
    });

    /**
     The `toHaveBeenCalled` matcher will pass if the spy was called.
     */
    it("tracks that the spy was called", function() {
        expect(foo.setBar).toHaveBeenCalled();
    });

    /**
     The `toHaveBeenCalledTimes` matcher will pass if the spy was called the
     specified number of times.
     */
    it("tracks that the spy was called x times", function() {
        expect(foo.setBar).toHaveBeenCalledTimes(2);
    });

    /**
     The `toHaveBeenCalledWith` matcher will return true if the argument list
     matches any of the recorded calls to the spy.
     */
    it("tracks all the arguments of its calls", function() {
        expect(foo.setBar).toHaveBeenCalledWith(123);
        expect(foo.setBar).toHaveBeenCalledWith(456, 'another param');
    });

    /**
     You get all of the data that a spy tracks about its calls with
     [calls](/api/edge/Spy_calls.html).
     */
    it("tracks if it was called at all", function() {
        foo.setBar();

        expect(foo.setBar.calls.any()).toEqual(true);
    });
});

/**
 ### Spies: `createSpy`

 When there is not a function to spy on, `jasmine.createSpy` can create a
 "bare" spy. This spy acts as any other spy - tracking calls, arguments, etc.
 But there is no implementation behind it.
 */
describe("A spy, when created manually", function() {
    let whatAmI;

    beforeEach(function() {
        whatAmI = jasmine.createSpy('whatAmI');

        whatAmI("I", "am", "a", "spy");
    });

    it("tracks that the spy was called", function() {
        expect(whatAmI).toHaveBeenCalled();
    });
});

/**
 ### Spies: `createSpyObj`

 In order to create a mock with multiple spies, use
 [jasmine.createSpyObj](/api/edge/jasmine.html#.createSpyObj) and pass an array
 of strings. It returns an object that has a property for each string that is a
 spy.
 */
describe("Multiple spies, when created manually", function() {
    let tape;

    beforeEach(function() {
        tape = jasmine.createSpyObj(
            'tape',
            ['play', 'pause', 'stop', 'rewind']
        );

        tape.play();
        tape.pause();
        tape.rewind(0);
    });

    it("creates spies for each requested function", function() {
        expect(tape.play).toBeDefined();
        expect(tape.pause).toBeDefined();
        expect(tape.stop).toBeDefined();
        expect(tape.rewind).toBeDefined();
    });
});

/**
 ## Matching with more finesse

 Sometimes you don't want to match with exact equality. Jasmine provides a
 number of asymmetric equality testers.
 */
describe("Matching with finesse", function() {
    /**
     [jasmine.any](/api/edge/jasmine.html#.any) takes a constructor or "class"
     name as an expected value. It returns `true` if the constructor matches the
     constructor of the actual value.
     */
    describe("jasmine.any", function () {
        it("matches any value", function () {
            expect({}).toEqual(jasmine.any(Object));
            expect(12).toEqual(jasmine.any(Number));
        });

        describe("when used with a spy", function () {
            it("is useful for comparing arguments", function () {
                const foo = jasmine.createSpy('foo');
                foo(12, function () {
                    return true;
                });

                expect(foo).toHaveBeenCalledWith(
                    jasmine.any(Number), jasmine.any(Function)
                );
            });
        });
    });

    /**
     [jasmine.anything](/api/edge/global.html#.anything) returns `true` if the
     actual value is not `null` or `undefined`.
     */
    describe("jasmine.anything", function () {
        it("matches anything", function () {
            expect(1).toEqual(jasmine.anything());
        });

        describe("when used with a spy", function () {
            it("is useful when the argument can be ignored", function () {
                const foo = jasmine.createSpy('foo');
                foo(12, function () {
                    return false;
                });

                expect(foo).toHaveBeenCalledWith(12, jasmine.anything());
            });
        });
    });

    /**
     [jasmine.objectContaining](/api/edge/global.html#.objectContaining) is for
     those times when an expectation only cares about certain key/value pairs
     in the actual.
     */
    describe("jasmine.objectContaining", function () {
        let foo;

        beforeEach(function () {
            foo = {
                a: 1,
                b: 2,
                bar: "baz"
            };
        });

        it("matches objects with the expect key/value pairs", function () {
            expect(foo).toEqual(jasmine.objectContaining({
                bar: "baz"
            }));
            expect(foo).not.toEqual(jasmine.objectContaining({
                c: 37
            }));
        });

        describe("when used with a spy", function () {
            it("is useful for comparing arguments", function () {
                const callback = jasmine.createSpy('callback');

                callback({
                    bar: "baz"
                });

                expect(callback).toHaveBeenCalledWith(
                    jasmine.objectContaining({bar: "baz"})
                );
            });
        });
    });

    /**
     [jasmine.arrayContaining](/api/edge/global.html#.arrayContaining is for
     those times when an expectation only cares about some of the values in an
     array.
     */
    describe("jasmine.arrayContaining", function () {
        let foo;

        beforeEach(function () {
            foo = [1, 2, 3, 4];
        });

        it("matches arrays with some of the values", function () {
            expect(foo).toEqual(jasmine.arrayContaining([3, 1]));
            expect(foo).not.toEqual(jasmine.arrayContaining([6]));
        });

        describe("when used with a spy", function () {
            it("is useful when comparing arguments", function () {
                const callback = jasmine.createSpy('callback');

                callback([1, 2, 3, 4]);

                expect(callback).toHaveBeenCalledWith(
                    jasmine.arrayContaining([4, 2, 3])
                );
                expect(callback).not.toHaveBeenCalledWith(
                    jasmine.arrayContaining([5, 2])
                );
            });
        });
    });

    /**
     ### [jasmine.stringMatching](/api/edge/global.html#.stringMatching) is for
     when you don't want to match a string in a larger object exactly, or match
     a portion of a string in a spy expectation.
     */
    describe('jasmine.stringMatching', function () {
        it("matches as a regexp", function () {
            expect({foo: 'bar'}).toEqual({
                foo: jasmine.stringMatching(/^bar$/)
            });
            expect({foo: 'foobarbaz'}).toEqual({
                foo: jasmine.stringMatching('bar')
            });
        });

        describe("when used with a spy", function () {
            it("is useful for comparing arguments", function () {
                const callback = jasmine.createSpy('callback');

                callback('foobarbaz');

                expect(callback).toHaveBeenCalledWith(
                    jasmine.stringMatching('bar')
                );
                expect(callback).not.toHaveBeenCalledWith(
                    jasmine.stringMatching(/^bar$/)
                );
            });
        });
    });

    /**
     ### Custom asymmetric equality tester

     When you need to check that something meets a certain criteria, without
     being strictly equal, you can also specify a custom asymmetric equality
     tester simply by providing an object that has an `asymmetricMatch` function.
     */
    describe("custom asymmetry", function () {
        const tester = {
            asymmetricMatch: function (actual) {
                const secondValue = actual.split(',')[1];
                return secondValue === 'bar';
            }
        };

        it("dives in deep", function () {
            expect("foo,bar,baz,quux").toEqual(tester);
        });

        describe("when used with a spy", function () {
            it("is useful for comparing arguments", function () {
                const callback = jasmine.createSpy('callback');

                callback('foo,bar,baz');

                expect(callback).toHaveBeenCalledWith(tester);
            });
        });
    });

    /**
     ## Jasmine Clock

     The [Jasmine Clock](/api/edge/Clock.html) is available for testing
     time-dependent code.
     */
    describe("Manually ticking the Jasmine Clock", function () {
        let timerCallback;

        /**
         It is installed with a call to `jasmine.clock().install` in a spec or
         suite that needs to manipulate time.
         */
        beforeEach(function () {
            timerCallback = jasmine.createSpy("timerCallback");
            jasmine.clock().install();
        });

        /**
         Be sure to uninstall the clock after you are done to restore the
         original functions.
         */
        afterEach(function () {
            jasmine.clock().uninstall();
        });

        /**
         ### Mocking the JavaScript Timeout Functions

         You can make `setTimeout` or `setInterval` synchronous executing the
         registered functions only once the clock is ticked forward in time.

         To execute registered functions, move time forward via the
         `jasmine.clock().tick` function, which takes a number of milliseconds.
         */
        it("causes a timeout to be called synchronously", function () {
            setTimeout(function () {
                timerCallback();
            }, 100);

            expect(timerCallback).not.toHaveBeenCalled();

            jasmine.clock().tick(101);

            expect(timerCallback).toHaveBeenCalled();
        });

        it("causes an interval to be called synchronously", function () {
            setInterval(function () {
                timerCallback();
            }, 100);

            expect(timerCallback).not.toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(timerCallback.calls.count()).toEqual(1);

            jasmine.clock().tick(50);
            expect(timerCallback.calls.count()).toEqual(1);

            jasmine.clock().tick(50);
            expect(timerCallback.calls.count()).toEqual(2);
        });

        /**
         ### Mocking the Date

         The Jasmine Clock can also be used to mock the current date.
         */
        describe("Mocking the Date object", function () {
            it("mocks the Date object and sets it to a given time", function () {
                const baseTime = new Date(2013, 9, 23);

                /**
                 If you do not provide a base time to `mockDate` it will use
                 the current date.
                 */
                jasmine.clock().mockDate(baseTime);

                jasmine.clock().tick(50);
                expect(new Date().getTime()).toEqual(baseTime.getTime() + 50);
            });
        });
    });
});


