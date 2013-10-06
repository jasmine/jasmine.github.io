/**
 # Jasmine Boot.js

 For Jasmine 2.0 we've made the location of this file configurable via jasmine.yml, at which point you can customize it.

 To copy the current version of `boot.js` you can run `jasmine copy_boot_js` if you are using the jasmine gem, otherwise you can grab this file from the [jasmine-core](https://github.com/pivotal/jasmine) repo.

 This is the default `boot.js` that is included in the Jasmine Core distribution.

 The `boot.js` file will be loaded after `jasmine.js` but before any source or specs.

*/
/*
 Copyright (c) 2008-2013 Pivotal Labs

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {

  /**
   * ## Require &amp; Instantiate
   *
   * These lines invoke the requiring of Jasmine. Specifically, this requires and attaches all of Jasmine's code to the `jasmine` reference.
   */
  window.jasmine = jasmineRequire.core(jasmineRequire);
  /**
   * Since this is being run in a browser we're additionally requiring the HTML-specific Jasmine code.
   */
  jasmineRequire.html(jasmine);

  /**
   *
   * This creates the Jasmine environment, which is used to run your specs.
   */
  var env = jasmine.getEnv();

  /**
   * We use this reference to inject jasmine's functionality into the `window`. The functions in this object are the full extent of jasmine's public interface.
   */
  var jasmineInterface = {
    describe: function(description, specDefinitions) {
      return env.describe(description, specDefinitions);
    },

    xdescribe: function(description, specDefinitions) {
      return env.xdescribe(description, specDefinitions);
    },

    it: function(desc, func) {
      return env.it(desc, func);
    },

    xit: function(desc, func) {
      return env.xit(desc, func);
    },

    beforeEach: function(beforeEachFunction) {
      return env.beforeEach(beforeEachFunction);
    },

    afterEach: function(afterEachFunction) {
      return env.afterEach(afterEachFunction);
    },

    expect: function(actual) {
      return env.expect(actual);
    },

    pending: function() {
      return env.pending();
    },

    addMatchers: function(matchers) {
      return env.addMatchers(matchers);
    },

    spyOn: function(obj, methodName) {
      return env.spyOn(obj, methodName);
    },

    clock: env.clock,

    addCustomEqualityTester: function(tester) {
      env.addCustomEqualityTester(tester);
    },

    jsApiReporter: new jasmine.JsApiReporter({
      timer: new jasmine.Timer()
    })
  };

  /**
   * Add all of the jasmine public interface to the proper global, so you can just write `describe` in your specs instead of `jasmine.describe`.
   */
  if (typeof window == "undefined" && typeof exports == "object") {
    extend(exports, jasmineInterface);
  } else {
    extend(window, jasmineInterface);
  }

  var queryString = new jasmine.QueryString({
    getWindowLocation: function() { return window.location; }
  });

  var catchingExceptions = queryString.getParam("catch");
  env.catchExceptions(typeof catchingExceptions === "undefined" ? true : catchingExceptions);

  /**
   * Set up the reporters that we use to present results later. This reporter draws the results from the suite on the screen as it receives them.
   */
  var htmlReporter = new jasmine.HtmlReporter({
    env: env,
    queryString: queryString,
    onRaiseExceptionsClick: function() { queryString.setParam("catch", !env.catchingExceptions()); },
    getContainer: function() { return document.body; },
    createElement: function() { return document.createElement.apply(document, arguments); },
    createTextNode: function() { return document.createTextNode.apply(document, arguments); },
    timer: new jasmine.Timer()
  });

  /**
   * The `jsApiReporter` also receives spec results, and is used by other projects that receive results from javascript. In practice, this approach is much easier than scraping the page.
   */
  env.addReporter(jasmineInterface.jsApiReporter);
  env.addReporter(htmlReporter);

  /**
   * Filter which specs will be run by matching the start of the full name against the `spec` query param.
   */
  var specFilter = new jasmine.HtmlSpecFilter({
    filterString: function() { return queryString.getParam("spec"); }
  });

  env.specFilter = function(spec) {
    return specFilter.matches(spec.getFullName());
  };

  var currentWindowOnload = window.onload;

  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    /**
     * This actually starts the `HtmlReporter` so it is ready to receive results and starts the jasmine test suite.
     */
    htmlReporter.initialize();
    env.execute();
  };

  function extend(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
  }

}());
