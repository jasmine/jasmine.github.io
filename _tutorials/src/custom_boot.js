/**
 If you want to customize your jasmine environment you can customize your boot.js file.

 The core of `boot.js` should stay the same, but you can add new things to the interface or configure things by changing this file.
 */

(function() {

  window.jasmine = jasmineRequire.core(jasmineRequire);

  jasmineRequire.html(jasmine);

  var env = jasmine.getEnv();

  /**
   * ## Customizing the interface
   *
   * Once the core jasmine interface has been loaded, you can add new functions or rewrite existing functions.
   */
  var jasmineInterface = jasmineRequire.interface(jasmine, env);

  /**
   * Here, we're adding some aliases so `before` is the same as `beforeEach`
   */
  jasmineInterface.before = jasmineInterface.beforeEach;
  /**
   * `after` is the same as `afterEach`
   */
  jasmineInterface.after = jasmineInterface.afterEach;
  /**
   * and `context` is the same as `describe`
   */
  jasmineInterface.context = jasmineInterface.describe;

  if (typeof window == "undefined" && typeof exports == "object") {
    extend(exports, jasmineInterface);
  } else {
    extend(window, jasmineInterface);
  }

  /**
   * ## Adding a custom reporter
   *
   * You can also add your own reporter either in addition to or in place of the `jsApiReporter` and `htmlReporter`
   */
  env.addReporter(jasmineInterface.jsApiReporter);


  /**
   * You can also customize how specs are filtered from the current run by changing the `env.specFilter` function
   *
   * Alternately, specs to be run may also be specified after the tests have been parsed by passing an array of suite
   * or spec IDs to the execute function.  These IDs can be gleaned by traversing the tree of parsed tests accessible
   * via env.topSuite().
   */
  var specFilter = new jasmine.HtmlSpecFilter({
    filterString: function() { return queryString.getParam("spec"); }
  });

  env.specFilter = function(spec) {
    return specFilter.matches(spec.getFullName());
  };

  window.setTimeout = window.setTimeout;
  window.setInterval = window.setInterval;
  window.clearTimeout = window.clearTimeout;
  window.clearInterval = window.clearInterval;

  /**
   * By default, Jasmine will begin execution when the `onload` event is triggered in the browser.
   * Replace this portion, if you want to wait for something else before calling `execute`
   */
  var currentWindowOnload = window.onload;

  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    env.execute(env.topSuite().id);
  };

  /**
   * Helper function to add the Jasmine public interface to the correct object.
   */
  function extend(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
  }

}());
