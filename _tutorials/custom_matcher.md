---
layout: tutorial
redirect_from:
  - "/edge/custom_matcher.html"
file_name: custom_matcher
order: 
---
<table cellspacing="0" cellpadding="0">
  <tbody>
  <tr id="section-1">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-1">&#182;</a>
      </div>
      <p>Often a project will want to encapsulate custom matching code for use across multiple specs. Here is how to create a Jasmine-compatible custom matcher.</p>

<p>A custom matcher at its root is a comparison function that takes an <code>actual</code> value and <code>expected</code> value. This factory is passed to Jasmine, ideally in a call to <code>beforeEach</code> and will be in scope and available for all of the specs inside a given call to <code>describe</code>. Custom matchers are torn down between specs. The name of the factory will be the name of the matcher exposed on the return value of the call to <code>expect</code>.</p>
    </td>
    <td class="code">
    </td>
  </tr>
  <tr id="section-2">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-2">&#182;</a>
      </div>
      <p>This object has a custom matcher named &quot;toBeGoofy&quot;.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
const customMatchers = {
```
</div>
    </td>
  </tr>
  <tr id="section-Matcher_Factories">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Matcher_Factories">&#182;</a>
      </div>
      <h2>Matcher Factories</h2>

<p>Custom matcher factories are passed a <code>matchersUtil</code> parameter, which has a set
of utility functions for matchers to use to perform tasks like determining
whether two objects are equal
(see: <a href="/api/edge/MatchersUtil.html"><code>MatchersUtil</code></a> for reference documentation). By using
<code>MatchersUtil</code> where appropriate, custom matchers can work with
<a href="/tutorials/custom_equality">custom equality testers</a> and
<a href="/tutorials/custom_object_formatters">custom object formatters</a> without any extra effort.</p>

<p>A second <code>customEqualityTesters</code> parameter is passed for compatibility with
Jasmine 3.5 and earlier. Matchers written for Jasmine 3.6 and later should
ignore it. It will no longer be provided in Jasmine 4.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    toBeGoofy: function(matchersUtil) {
```
</div>
    </td>
  </tr>
  <tr id="section-4">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-4">&#182;</a>
      </div>
      <p>The factory method should return an object with a <code>compare</code> function that will be called to check the expectation.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
        return {
```
</div>
    </td>
  </tr>
  <tr id="section-A_Function_to_&lt;code&gt;compare&lt;/code&gt;">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-A_Function_to_&lt;code&gt;compare&lt;/code&gt;">&#182;</a>
      </div>
      <h2>A Function to <code>compare</code></h2>

<p>The compare function receives the value passed to <code>expect()</code> as the first argument - the actual - and the value (if any) passed to the matcher itself as second argument.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
            compare: function(actual, expected) {
```
</div>
    </td>
  </tr>
  <tr id="section-6">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-6">&#182;</a>
      </div>
      <p><code>toBeGoofy</code> takes an optional <code>expected</code> argument, so define it here if not passed in.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
                if (expected === undefined) {
                    expected = '';
                }
```
</div>
    </td>
  </tr>
  <tr id="section-Result">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Result">&#182;</a>
      </div>
      <h3>Result</h3>

<p>The <code>compare</code> function must return a result object with a <code>pass</code> property that is a boolean result of the matcher. The <code>pass</code> property tells the expectation whether the matcher was successful (<code>true</code>) or unsuccessful (<code>false</code>). If the expectation is called/chained with <code>.not</code>, the expectation will negate this to determine whether the expectation is met.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
                const result = {
                };
```
</div>
    </td>
  </tr>
  <tr id="section-8">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-8">&#182;</a>
      </div>
      <p><code>toBeGoofy</code> tests for equality of the actual&#39;s <code>hyuk</code> property to see if it matches the expectation.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
                result.pass = matchersUtil.equals(actual.hyuk, "gawrsh" + expected);
```
</div>
    </td>
  </tr>
  <tr id="section-Failure_Messages">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Failure_Messages">&#182;</a>
      </div>
      <h3>Failure Messages</h3>

<p>If left <code>undefined</code>, the expectation will attempt to craft a failure message for the matcher. However, if the return value has a <code>message</code> property it will be used for a  failed expectation.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
                if (result.pass) {
```
</div>
    </td>
  </tr>
  <tr id="section-10">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-10">&#182;</a>
      </div>
      <p>The matcher succeeded, so the custom failure message should be present in the case of a negative expectation - when the expectation is used with <code>.not</code>.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
                    result.message = "Expected " + actual + " not to be quite so goofy";
                } else {
```
</div>
    </td>
  </tr>
  <tr id="section-11">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-11">&#182;</a>
      </div>
      <p>The matcher failed, so the custom failure message should be present in the case of a positive expectation</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
                    result.message = "Expected " + actual + " to be goofy, but it was not very goofy";
                }
```
</div>
    </td>
  </tr>
  <tr id="section-12">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-12">&#182;</a>
      </div>
      <p>Return the result of the comparison.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
                return result;
            }
        };
    }
};
```
</div>
    </td>
  </tr>
  <tr id="section-Custom_negative_comparators">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Custom_negative_comparators">&#182;</a>
      </div>
      <h3>Custom negative comparators</h3>

<p>If you need more control over the negative comparison (the <code>not</code> case) than the simple boolean inversion above, you can also have your matcher factory include another key, <code>negativeCompare</code> alongside <code>compare</code>, for which the value is a function to invoke when <code>.not</code> is used. This function/key is optional.</p>
    </td>
    <td class="code">
    </td>
  </tr>
  <tr id="section-Registration_and_Usage">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Registration_and_Usage">&#182;</a>
      </div>
      <h2>Registration and Usage</h2>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("Custom matcher: 'toBeGoofy'", function() {
```
</div>
    </td>
  </tr>
  <tr id="section-15">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-15">&#182;</a>
      </div>
      <p>Register the custom matchers with Jasmine. All properties on the object passed in will be available as custom matchers (e.g., in this case <code>toBeGoofy</code>).</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    beforeEach(function() {
        jasmine.addMatchers(customMatchers);
    });
```
</div>
    </td>
  </tr>
  <tr id="section-16">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-16">&#182;</a>
      </div>
      <p>Once a custom matcher is registered with Jasmine, it is available on any expectation.</p>

    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("is available on an expectation", function() {
        expect({
            hyuk: 'gawrsh'
        }).toBeGoofy();
    });

    it("can take an 'expected' parameter", function() {
        expect({
            hyuk: 'gawrsh is fun'
        }).toBeGoofy(' is fun');
    });

    it("can be negated", function() {
        expect({
            hyuk: 'this is fun'
        }).not.toBeGoofy();
    });
});
```
</div>
    </td>
  </tr>
  </tbody>
</table>
