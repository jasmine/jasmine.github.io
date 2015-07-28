/**
  A number of things have changed with the release of jasmine 2.0
  */

describe("Upgrading to jasmine 2.0", function() {
  /**
    ## Custom Matchers
    */
  describe("Custom Matchers", function() {
    beforeEach(function() {
      /**
        The `addMatchers` function is no longer on the spec (`this`) it is now on the global `jasmine` object.
        */

      /* was:
         this.addMatchers({
      */
      jasmine.addMatchers({
        /**
          A matcher is set up a bit different now.
          The factory receives a `util` object which contains things like jasmines equality functions, and any registered `customEqualityTesters`.
          The factory is expected to return an object with a `compare` function which will be called with the `actual` and `expected` directly,
          instead of the actual value being on `this`
          */

        /* was:
           toBeCustom: function(expected) {
             var passed = this.actual == expected;
        */
        toBeCustom: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              var passed = actual == expected
              /**
               * The comparison should now return an object with `pass` and `message` attributes.
               *
               * For more information on the <a href="custom_matcher.html">use of custom matchers</a>.
               * This page is intended to show the changes necessary to upgrade a 1.x suite to 2.0
               */
              /* was:
                this.message = function() {
                  return [
                    'Expected ' + this.actual + ' to equal ' + expected,
                    'Expected ' + this.actual + ' not to equal ' + expected
                  ];
                };
                return passed;
                });
                */
              return {
                pass: passed,
                message: 'Expected ' + actual + (passed ? '' : ' not') + ' to equal ' + expected
              };
            }
          };
        }
      });
    });

    /**
     * Use of custom matchers remains the same
     */
    it("uses custom matchers", function() {
      expect(1).toBeCustom(1);
    });
  });

  /**
    ## Asynchronous Specs
    */
  describe("Asynchronous Specs", function() {
    /**
     * We'll pretend this is asynchronous for our tests below
     */
    var asyncSetThing,
    somethingAsyncWithCallback = function(callback) {
      asyncSetThing = true;
      callback();
    };

    /**
     * The `runs`, `waits`, and `waitsFor` methods have been removed in favor of allowing functions
     * run as part of the spec to receive and invoke a `done` callback.
     */
    /* was:
       it("calls an async thing and waits", function() {
         var asyncDone = false;
         somethingAsyncWithCallback(function() {
           asyncDone = true
         });

  // While it used to be necessary to keep track of the async state in the spec itself.
         waitsFor(function() {
           return asyncDone;
         });
     */
    /**
     * By having a `beforeEach`, `afterEach`, or `it` receive a `done` callback, jasmine will wait until that function is invoked
     * before moving to the next thing in the queue. This means if the asynchronous logic also takes a callback for when it is done,
     * jasmines `done` can just be passed through and jasmine will wait appropriately.
     */
    beforeEach(function(done) {
      somethingAsyncWithCallback(done);
    });

    /*
       runs(function() {
         expect(asyncSetThing).toBeTruthy();
       });
     });
     */
    it("will wait until async completes and calls done", function() {
      expect(asyncSetThing).toBeTruthy();
    });
  });

  /**
    ## Spies
    */
  describe("Spies", function() {
    it('should spy', function() {
      var spy = jasmine.createSpy('spy');

      /**
        All the ways to tell the spy how to behave are no longer their own attribute directly on the spy.
        There is a single `and` attribute that has all of the spy behaviors on it so fewer attributes are added to the function being spied upon.
        */
       /* was:
        spy.andCallThrough();
        spy.andCallFake(function() {});
        spy.andThrow('error');
        spy.andReturn(1);
        */
      spy.and.callThrough();
      spy.and.callFake(function() {});
      spy.and.throwError('error');
      spy.and.returnValue(1);
      spy.and.returnValues(11,22,33);
      /**
        Basic setup and check remains the same
        */
      spy('foo');
      spy('bar');

      expect(spy).toHaveBeenCalledWith('foo');

      /**
       * Similarly to behaviors, more advanced call checks are on the `calls` attribute
       */
      /* was:
         expect(spy.mostRecentCall.args).toEqual(['bar']);
         expect(spy.callCount).toBe(2);
       */
      expect(spy.calls.mostRecent().args).toEqual(['bar']);
      expect(spy.calls.count()).toBe(2);
    });
  });

  /**
   ## Clock
   */
  describe("Clock", function() {
    /**
     * The jasmine mock clock is now an instanciated object and not a global,
     * and it is now `install`ed instead of being told to `useMock`.
     */
    beforeEach(function() {
    /* was:
       jasmine.Clock.useMock();
     */
      jasmine.clock().install();
    });

    /**
     * `tick`ing the clock remains basically the same
     */
    it("uses the clock similarly", function() {
      /* was:
         jasmine.Clock.tick();
       */
      jasmine.clock().tick();
    });

    /**
     * Jasmine 2.0 removes the ability for addons to dynamically add `afterEach` callbacks.
     * In order to keep the clock from being a special object that is able to uninstall itself, it now needs to be manually uninstalled.
     */
    afterEach(function() {
      jasmine.clock().uninstall();
    });
  });
});
