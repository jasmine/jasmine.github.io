---
layout: tutorial
include_docco: true
redirect_from:
  - "/edge/mocking_ajax.html"
file_name: mocking_ajax
order: 
---
<table cellspacing="0" cellpadding="0" class="docco">
  <tbody>
  <tr id="section-Testing_ajax_calls">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Testing_ajax_calls">&#182;</a>
      </div>
      <h2>Testing ajax calls</h2>

<p>We have written a plugin called <a href="https://github.com/pivotal/jasmine-ajax">jasmine-ajax</a> that allows ajax calls to be mocked out in tests.
To use it, you need to download the <code>mock-ajax.js</code> file and add it to your jasmine helpers so it gets loaded before any specs that use it.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("mocking ajax", function() {
```
</div>
    </td>
  </tr>
  <tr id="section-Basic_Usage_Across_An_Entire_Suite">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Basic_Usage_Across_An_Entire_Suite">&#182;</a>
      </div>
      <h3>Basic Usage Across An Entire Suite</h3>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    describe("suite wide usage", function() {
```
</div>
    </td>
  </tr>
  <tr id="section-3">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-3">&#182;</a>
      </div>
      <p>When you want to mock out all ajax calls across an entire suite, use <code>install()</code> in a <code>beforeEach</code>.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
        beforeEach(function() {
            jasmine.Ajax.install();
        });
```
</div>
    </td>
  </tr>
  <tr id="section-4">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-4">&#182;</a>
      </div>
      <p>Because jasmine-ajax stubs out the global XMLHttpRequest for the page, you&#39;ll want to <code>uninstall()</code> in an <code>afterEach</code> so specs or setup that expect to make a real ajax request can.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it("specifying response when you need it", function() {
            const doneFn = jasmine.createSpy("success");
```
</div>
    </td>
  </tr>
  <tr id="section-5">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-5">&#182;</a>
      </div>
      <p>Make your requests as normal.
Jasmine-Ajax mocks out your request at the XMLHttpRequest object, so should be compatible with other libraries that do ajax requests.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(args) {
                if (this.readyState == this.DONE) {
                    doneFn(this.responseText);
                }
            };

            xhr.open("GET", "/some/cool/url");
            xhr.send();
```
</div>
    </td>
  </tr>
  <tr id="section-6">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-6">&#182;</a>
      </div>
      <p>At this point the ajax request won&#39;t have returned, so any assertions about intermediate states (like spinners) can be run here.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
            expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/cool/url');
            expect(doneFn).not.toHaveBeenCalled();
```
</div>
    </td>
  </tr>
  <tr id="section-7">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-7">&#182;</a>
      </div>
      <p>Now we tell the request what it&#39;s response should look like</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
            jasmine.Ajax.requests.mostRecent().respondWith({
```
</div>
    </td>
  </tr>
  <tr id="section-8">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-8">&#182;</a>
      </div>
      <p>HTTP response code</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
                "status": 200,
```
</div>
    </td>
  </tr>
  <tr id="section-9">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-9">&#182;</a>
      </div>
      <p>You can also specify the content type of the response</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
                "contentType": 'text/plain',
```
</div>
    </td>
  </tr>
  <tr id="section-10">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-10">&#182;</a>
      </div>
      <p><code>responseText</code> to return, this should be a string.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
                "responseText": 'awesome response'
            });
```
</div>
    </td>
  </tr>
  <tr id="section-11">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-11">&#182;</a>
      </div>
      <p>Now that we&#39;ve told the request to respond, our callback gets called.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
            expect(doneFn).toHaveBeenCalledWith('awesome response');
        });
```
</div>
    </td>
  </tr>
  <tr id="section-12">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-12">&#182;</a>
      </div>
      <p>You can also specify responses ahead of time and they will respond immediately when the request is made.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
        it("allows responses to be setup ahead of time", function () {
            const doneFn = jasmine.createSpy("success");
```
</div>
    </td>
  </tr>
  <tr id="section-13">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-13">&#182;</a>
      </div>
      <p>Call <code>stubRequest</code> with the url you want to return immediately.
Then <code>andReturn</code> receives the same type of argument as <code>respondWith</code>.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
            jasmine.Ajax.stubRequest('/another/url').andReturn({
                "responseText": 'immediate response'
            });
```
</div>
    </td>
  </tr>
  <tr id="section-14">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-14">&#182;</a>
      </div>
      <p>Make your requests as normal</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
            const xhr = new XMLHttpRequest();
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
```
</div>
    </td>
  </tr>
  <tr id="section-15">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-15">&#182;</a>
      </div>
      <p>If you only want to use it in a single spec, you can use <code>withMock</code>.
<code>withMock</code> takes a function that will be called after ajax has been mocked, and the mock will be uninstalled when the function completes.</p>

    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("allows use in a single spec", function() {
        const doneFn = jasmine.createSpy('success');
        jasmine.Ajax.withMock(function() {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(args) {
                if (this.readyState == this.DONE) {
                    doneFn(this.responseText);
                }
            };

            xhr.open("GET", "/some/cool/url");
            xhr.send();

            expect(doneFn).not.toHaveBeenCalled();

            jasmine.Ajax.requests.mostRecent().respondWith({
                "status": 200,
                "responseText": 'in spec response'
            });
    
            expect(doneFn).toHaveBeenCalledWith('in spec response');
        });
    });
});
```
</div>
    </td>
  </tr>
  </tbody>
</table>
