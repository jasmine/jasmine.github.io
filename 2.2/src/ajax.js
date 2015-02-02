/**
 * ## Testing ajax calls
 * We have written a plugin called [jasmine-ajax](https://github.com/pivotal/jasmine-ajax) that allows ajax calls to be mocked out in tests.
 * To use it, you need to download the `mock-ajax.js` file and add it to your jasmine helpers so it gets loaded before any specs that use it.
 */
describe("mocking ajax", function() {
  /**
   * ### Basic Usage Across An Entire Suite
   */
  describe("suite wide usage", function() {
    /**
     * When you want to mock out all ajax calls across an entire suite, use `install()` in a `beforeEach`.
     */
    beforeEach(function() {
      jasmine.Ajax.install();
    });

    /**
     * Because jasmine-ajax stubs out the global XMLHttpRequest for the page, you'll want to `uninstall()` in an `afterEach` so specs or setup that expect to make a real ajax request can.
     */
    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("specifying response when you need it", function() {
      var doneFn = jasmine.createSpy("success");

      /**
       * Make your requests as normal.
       * Jasmine-Ajax mocks out your request at the XMLHttpRequest object, so should be compatible with other libraries that do ajax requests.
       */
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(args) {
        if (this.readyState == this.DONE) {
          doneFn(this.responseText);
        }
      };

      xhr.open("GET", "/some/cool/url");
      xhr.send();

      /**
       * At this point the ajax request won't have returned, so any assertions about intermediate states (like spinners) can be run here.
       */
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/cool/url');
      expect(doneFn).not.toHaveBeenCalled();

      /**
       * Now we tell the request what it's response should look like
       */
      jasmine.Ajax.requests.mostRecent().response({
        /**
         * HTTP response code
         */
        "status": 200,
        /**
         * You can also specify the content type of the response
         */
        "contentType": 'text/plain',
        /**
         * `responseText` to return, this should be a string.
         */
        "responseText": 'awesome response'
      });

      /**
       * Now that we've told the request to respond, our callback gets called.
       */
      expect(doneFn).toHaveBeenCalledWith('awesome response');
    });

    /**
     * You can also specify responses ahead of time and they will respond immediately when the request is made.
     */
    it("allows responses to be setup ahead of time", function () {
      var doneFn = jasmine.createSpy("success");

      /**
       * Call `stubRequest` with the url you want to return immediately.
       * Then `andReturn` receives the same type of argument as `response`
       */
      jasmine.Ajax.stubRequest('/another/url').andReturn({
        "responseText": 'immediate response'
      });

      /**
       * Make your requests as normal
       */
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(args) {
        if (this.readyState == this.DONE) {
          doneFn(this.responseText);
        }
      };

      xhr.open("GET", "/another/url");
      xhr.send();

      expect(doneFn).toHaveBeenCalledWith('immediate response');
    });
  });

  /**
   * If you only want to use it in a single spec, you can use `withMock`.
   * `withMock` takes a function that will be called after ajax has been mocked, and the mock will be uninstalled when the function completes.
   */
  it("allows use in a single spec", function() {
    var doneFn = jasmine.createSpy('success');
    jasmine.Ajax.withMock(function() {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(args) {
        if (this.readyState == this.DONE) {
          doneFn(this.responseText);
        }
      };

      xhr.open("GET", "/some/cool/url");
      xhr.send();

      expect(doneFn).not.toHaveBeenCalled();

      jasmine.Ajax.requests.mostRecent().response({
        "status": 200,
        "responseText": 'in spec response'
      });

      expect(doneFn).toHaveBeenCalledWith('in spec response');
    });
  });
});
