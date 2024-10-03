---
layout: tutorial
include_docco: true
redirect_from:
  - "/edge/your_first_suite.html"
  - "/edge/introduction.html"
file_name: your_first_suite
order: 0
---
<table cellspacing="0" cellpadding="0" class="docco">
  <tbody>
  <tr id="section-Suites:_&lt;code&gt;describe&lt;/code&gt;_Your_Tests">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Suites:_&lt;code&gt;describe&lt;/code&gt;_Your_Tests">&#182;</a>
      </div>
      <h2>Suites: <code>describe</code> Your Tests</h2>

<p>The <a href="/api/edge/global.html#describe">describe</a> function is for grouping related specs, typically each test file has one at the top level.
The string parameter is for naming the collection of specs, and will be concatenated with specs to make a spec&#39;s full name.
This aids in finding specs in a large suite.
If you name them well, your specs read as full sentences in traditional <a href="http://en.wikipedia.org/wiki/Behavior-driven_development">BDD</a> style.</p>

<h2>Specs</h2>

<p>Specs are defined by calling the global Jasmine function <a href="/api/edge/global.html#it">it</a>, which, like <code>describe</code> takes a string and a function.
The string is the title of the spec and the function is the spec, or test.
A spec contains one or more expectations that test the state of the code.
An expectation in Jasmine is an assertion that is either true or false.
A spec with all true expectations is a passing spec. A spec with one or more false expectations is a failing spec.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("A suite", function() {
    it("contains spec with an expectation", function() {
        expect(true).toBe(true);
    });
});
```
</div>
    </td>
  </tr>
  <tr id="section-It&amp;#39;s_Just_Functions">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-It&amp;#39;s_Just_Functions">&#182;</a>
      </div>
      <h3>It&#39;s Just Functions</h3>

<p>Since <code>describe</code> and <code>it</code> blocks are functions, they can contain any executable code necessary to implement the test. JavaScript scoping rules apply, so variables declared in a <code>describe</code> are available to any <code>it</code> block inside the suite.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("A suite is just a function", function() {
    let a;

    it("and so is a spec", function() {
        a = true;

        expect(a).toBe(true);
    });
});
```
</div>
    </td>
  </tr>
  <tr id="section-Expectations">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Expectations">&#182;</a>
      </div>
      <h2>Expectations</h2>

<p>Expectations are built with the function <code>expect</code> which takes a value, called the actual.
It is chained with a Matcher function, which takes the expected value.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("The 'toBe' matcher compares with ===", function() {
```
</div>
    </td>
  </tr>
  <tr id="section-Matchers">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Matchers">&#182;</a>
      </div>
      <h3>Matchers</h3>

<p>Each matcher implements a boolean comparison between the actual value and the expected value.
It is responsible for reporting to Jasmine if the expectation is true or false.
Jasmine will then pass or fail the spec.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("and has a positive case", function() {
        expect(true).toBe(true);
    });
```
</div>
    </td>
  </tr>
  <tr id="section-5">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-5">&#182;</a>
      </div>
      <p>Any matcher can evaluate to a negative assertion by chaining the call to <code>expect</code> with a <code>not</code> before calling the matcher.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("and can have a negative case", function() {
        expect(false).not.toBe(true);
    });
```
</div>
    </td>
  </tr>
  <tr id="section-6">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-6">&#182;</a>
      </div>
      <p>Jasmine has a rich set of matchers included, you can find the full list in the <a href="/api/edge/matchers.html">API docs</a>
There is also the ability to write <a href="custom_matcher.html">custom matchers</a> for when a project&#39;s domain calls for specific assertions that are not included in Jasmine.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
});
```
</div>
    </td>
  </tr>
  <tr id="section-Setup_and_Teardown">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Setup_and_Teardown">&#182;</a>
      </div>
      <h3>Setup and Teardown</h3>

<p>To help a test suite DRY up any duplicated setup and teardown code, Jasmine provides the global <a href="/api/edge/global.html#beforeEach">beforeEach</a>, <a href="/api/edge/global.html#afterEach">afterEach</a>, <a href="/api/edge/global.html#beforeAll">beforeAll</a>, and <a href="/api/edge/global.html#afterAll">afterAll</a> functions.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("A suite with some shared setup", function() {
    let foo = 0;
```
</div>
    </td>
  </tr>
  <tr id="section-8">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-8">&#182;</a>
      </div>
      <p>As the name implies, the <code>beforeEach</code> function is called once before each spec in the <code>describe</code> in which it is called</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    beforeEach(function() {
        foo += 1;
    });
```
</div>
    </td>
  </tr>
  <tr id="section-9">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-9">&#182;</a>
      </div>
      <p>and the <code>afterEach</code> function is called once after each spec.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    afterEach(function() {
        foo = 0;
    });
```
</div>
    </td>
  </tr>
  <tr id="section-10">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-10">&#182;</a>
      </div>
      <p>The <code>beforeAll</code> function is called only once before all the specs in <code>describe</code> are run</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    beforeAll(function() {
        foo = 1;
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
      <p>and the <code>afterAll</code> function is called after all specs finish</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    afterAll(function() {
        foo = 0;
    });
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
      <p><code>beforeAll</code> and <code>afterAll</code> can be used to speed up test suites with expensive setup and teardown.</p>

<p>However, be careful using <code>beforeAll</code> and <code>afterAll</code>!
Since they are not reset between specs, it is easy to accidentally leak state between your specs so that they erroneously pass or fail.</p>
    </td>
    <td class="code">
    </td>
  </tr>
  <tr id="section-The_&lt;code&gt;this&lt;/code&gt;_keyword">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-The_&lt;code&gt;this&lt;/code&gt;_keyword">&#182;</a>
      </div>
      <h3>The <code>this</code> keyword</h3>

<p>Another way to share variables between a <code>beforeEach</code>, <code>it</code>, and <code>afterEach</code> is through the <code>this</code> keyword. Each spec&#39;s <code>beforeEach</code>/<code>it</code>/<code>afterEach</code> has the <code>this</code> as the same empty object that is set back to empty for the next spec&#39;s <code>beforeEach</code>/<code>it</code>/<code>afterEach</code>.</p>
<p><em>Note:</em> If you want to use the <code>this</code> keyword to share
    variables, you must use the <code>function</code> keyword and not arrow
    functions.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
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
```
</div>
    </td>
  </tr>
  <tr id="section-Manually_failing_a_spec_with_&lt;code&gt;fail&lt;/code&gt;">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Manually_failing_a_spec_with_&lt;code&gt;fail&lt;/code&gt;">&#182;</a>
      </div>
      <h3>Manually failing a spec with <code>fail</code></h3>

<p>The <code>fail</code> function causes a spec to fail. It can take a failure message or an Error object as a parameter.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("A spec using the fail function", function() {
    function foo(x, callBack) {
        if (x) {
            callBack();
        }
    };

    it("should not call the callBack", function() {
        foo(false, function() {
            fail("Callback has been called");
        });
    });
});
```
</div>
    </td>
  </tr>
  <tr id="section-Nesting_&lt;code&gt;describe&lt;/code&gt;_Blocks">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Nesting_&lt;code&gt;describe&lt;/code&gt;_Blocks">&#182;</a>
      </div>
      <h3>Nesting <code>describe</code> Blocks</h3>

<p>Calls to <code>describe</code> can be nested, with specs defined at any level. This allows a suite to be composed as a tree of functions. Before a spec is executed, Jasmine walks down the tree executing each <code>beforeEach</code> function in order. After the spec is executed, Jasmine walks through the <code>afterEach</code> functions similarly.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
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
```
</div>
    </td>
  </tr>
  <tr id="section-Disabling_Suites">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Disabling_Suites">&#182;</a>
      </div>
      <h2>Disabling Suites</h2>

<p>Suites can be disabled with the <code>xdescribe</code> function. These suites and any specs inside them are skipped when run and thus their results will show as pending.</p>
      <p>Suites can also be focused with the <code>fdescribe</code> function. That means only <code>fdescribe</code> suits will run.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
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
```
</div>
    </td>
  </tr>
  <tr id="section-Pending_Specs">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Pending_Specs">&#182;</a>
      </div>
      <h2>Pending Specs</h2>

<p>Pending specs do not run, but their names will show up in the results as <code>pending</code>.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("Pending specs", function() {
```
</div>
    </td>
  </tr>
  <tr id="section-18">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-18">&#182;</a>
      </div>
      <p>Any spec declared with <code>xit</code> is marked as pending.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    xit("can be declared 'xit'", function() {
        expect(true).toBe(false);
    });
```
</div>
    </td>
  </tr>
  <tr id="section-19">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-19">&#182;</a>
      </div>
      <p>Any spec declared without a function body will also be marked pending in results.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("can be declared with 'it' but without a function");
```
</div>
    </td>
  </tr>
  <tr id="section-20">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-20">&#182;</a>
      </div>
      <p>And if you call the function <code>pending</code> anywhere in the spec body, no matter the expectations, the spec will be marked pending.
A string passed to <code>pending</code> will be treated as a reason and displayed when the suite finishes.</p>
      <p>Tests can also be focused with the <code>fit</code> function. That means only <code>fit</code> tests will run.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("can be declared by calling 'pending' in the spec body", function() {
        expect(true).toBe(false);
        pending('this is why it is pending');
    });
});
```
</div>
    </td>
  </tr>
  <tr id="section-Spies">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Spies">&#182;</a>
      </div>
      <h2>Spies</h2>

<p>Jasmine has test double functions called <a href="/api/edge/Spy.html">spies</a>.
A spy can stub any function and tracks calls to it and all arguments.
A spy only exists in the <code>describe</code> or <code>it</code> block in which it is defined, and will be removed after each spec.
There are special matchers for interacting with spies.Spies function  are never executed so our function setBar will not run insted our spy function will run.We can set a spy using spyOn function.Currently, we are calling spy function on setBar property of foo object.So our spy will keep track of how many times it ran,with what arguments,etc.Our setBar function ,which sets value of bar, is never called.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("A spy", function() {
    let foo;
    let bar = null;

    beforeEach(function() {
        foo = {
            setBar: function(value) {
                bar = value;
            }
        };
```
</div>
    </td>
  </tr>
  <tr id="section-22">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-22">&#182;</a>
      </div>
      <p>You can define what the spy will do when invoked with <a href="/api/edge/Spy.html#and">and</a>.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
        spyOn(foo, 'setBar');

        foo.setBar(123);
        foo.setBar(456, 'another param');
    });
```
</div>
    </td>
  </tr>
  <tr id="section-23">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-23">&#182;</a>
      </div>
      <p>The <code>toHaveBeenCalled</code> matcher will pass if the spy was called.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("tracks that the spy was called", function() {
        expect(foo.setBar).toHaveBeenCalled();
    });
```
</div>
    </td>
  </tr>
  <tr id="section-24">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-24">&#182;</a>
      </div>
      <p>The <code>toHaveBeenCalledTimes</code> matcher will pass if the spy was called the specified number of times.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("tracks that the spy was called x times", function() {
        expect(foo.setBar).toHaveBeenCalledTimes(2);
    });
```
</div>
    </td>
  </tr>
  <tr id="section-25">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-25">&#182;</a>
      </div>
      <p>The <code>toHaveBeenCalledWith</code> matcher will return true if the argument list matches any of the recorded calls to the spy.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("tracks all the arguments of its calls", function() {
        expect(foo.setBar).toHaveBeenCalledWith(123);
        expect(foo.setBar).toHaveBeenCalledWith(456, 'another param');
    });

    it("stops all execution on a function", function() {
        expect(bar).toBeNull();
    });
```
</div>
    </td>
  </tr>
  <tr id="section-26">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-26">&#182;</a>
      </div>
      <p>You get all of the data that a spy tracks about its calls with <a href="/api/edge/Spy_calls.html">calls</a></p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("tracks if it was called at all", function() {
        foo.setBar();

        expect(foo.setBar.calls.any()).toEqual(true);
    });
});
```
</div>
    </td>
  </tr>
  <tr id="section-Spies:_&lt;code&gt;createSpy&lt;/code&gt;">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Spies:_&lt;code&gt;createSpy&lt;/code&gt;">&#182;</a>
      </div>
      <h3>Spies: <code>createSpy</code></h3>

<p>When there is not a function to spy on, <a href="/api/edge/jasmine.html#.createSpy">jasmine.createSpy</a> can create a &quot;bare&quot; spy.
This spy acts as any other spy - tracking calls, arguments, etc. But there is no implementation behind it.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
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
```
</div>
    </td>
  </tr>
  <tr id="section-Spies:_&lt;code&gt;createSpyObj&lt;/code&gt;">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Spies:_&lt;code&gt;createSpyObj&lt;/code&gt;">&#182;</a>
      </div>
      <h3>Spies: <code>createSpyObj</code></h3>

<p>In order to create a mock with multiple spies, use <a href="/api/edge/jasmine.html#.createSpyObj">jasmine.createSpyObj</a> and pass an array of strings.
It returns an object that has a property for each string that is a spy.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
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
```
</div>
    </td>
  </tr>
  <tr id="section-Matching_with_more_finesse">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Matching_with_more_finesse">&#182;</a>
      </div>
      <h2>Matching with more finesse</h2>

<p>Sometimes you don&#39;t want to match with exact equality.
Jasmine provides a number of asymmetric equality testers.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("Matching with finesse", function() {
```
</div>
    </td>
  </tr>
  <tr id="section-30">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-30">&#182;</a>
      </div>
      <p><a href="/api/edge/jasmine.html#.any">jasmine.any</a> takes a constructor or &quot;class&quot; name as an expected value.
It returns <code>true</code> if the constructor matches the constructor of the actual value.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    describe("jasmine.any", function() {
        it("matches any value", function() {
            expect({}).toEqual(jasmine.any(Object));
            expect(12).toEqual(jasmine.any(Number));
        });
    
        describe("when used with a spy", function() {
            it("is useful for comparing arguments", function() {
                const foo = jasmine.createSpy('foo');
                foo(12, function() {
                    return true;
                });
    
                expect(foo).toHaveBeenCalledWith(
                    jasmine.any(Number), jasmine.any(Function)
                );
            });
        });
    });
```
</div>
    </td>
  </tr>
  <tr id="section-31">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-31">&#182;</a>
      </div>
      <p><a href="/api/edge/global.html#.anything">jasmine.anything</a> returns <code>true</code> if the actual value is not <code>null</code> or <code>undefined</code>.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    describe("jasmine.anything", function() {
        it("matches anything", function() {
            expect(1).toEqual(jasmine.anything());
        });

        describe("when used with a spy", function() {
            it("is useful when the argument can be ignored", function() {
                const foo = jasmine.createSpy('foo');
                foo(12, function() {
                    return false;
                });

                expect(foo).toHaveBeenCalledWith(12, jasmine.anything());
            });
        });
    });
```
</div>
    </td>
  </tr>
  <tr id="section-32">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-32">&#182;</a>
      </div>
      <p><a href="/api/edge/global.html#.objectContaining">jasmine.objectContaining</a> is for those times when an expectation only cares about certain key/value pairs in the actual.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    describe("jasmine.objectContaining", function() {
        let foo;

        beforeEach(function() {
            foo = {
                a: 1,
                b: 2,
                bar: "baz"
            };
        });

        it("matches objects with the expect key/value pairs", function() {
            expect(foo).toEqual(jasmine.objectContaining({
                bar: "baz"
            }));
            expect(foo).not.toEqual(jasmine.objectContaining({
                c: 37
            }));
        });

        describe("when used with a spy", function() {
            it("is useful for comparing arguments", function() {
                const callback = jasmine.createSpy('callback');

                callback({
                    bar: "baz"
                });

                expect(callback).toHaveBeenCalledWith(
                    jasmine.objectContaining({ bar: "baz" })
                );
            });
        });
    });
```
</div>
    </td>
  </tr>
  <tr id="section-33">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-33">&#182;</a>
      </div>
      <p><a href="/api/edge/global.html#.arrayContaining">jasmine.arrayContaining</a> is for those times when an expectation only cares about some of the values in an array.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    describe("jasmine.arrayContaining", function() {
        let foo;

        beforeEach(function() {
            foo = [1, 2, 3, 4];
        });

        it("matches arrays with some of the values", function() {
            expect(foo).toEqual(jasmine.arrayContaining([3, 1]));
            expect(foo).not.toEqual(jasmine.arrayContaining([6]));
        });

        describe("when used with a spy", function() {
            it("is useful when comparing arguments", function() {
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
```
</div>
    </td>
  </tr>
  <tr id="section-34">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-34">&#182;</a>
      </div>
      <p><a href="/api/edge/global.html#.stringMatching">jasmine.stringMatching</a> is for when you don&#39;t want to match a string in a larger object exactly, or match a portion of a string in a spy expectation.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    describe('jasmine.stringMatching', function() {
        it("matches as a regexp", function() {
            expect({foo: 'bar'}).toEqual({
                foo: jasmine.stringMatching(/^bar$/)
            });
            expect({foo: 'foobarbaz'}).toEqual({
                foo: jasmine.stringMatching('bar')
            });
        });

        describe("when used with a spy", function() {
            it("is useful for comparing arguments", function() {
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
```
</div>
    </td>
  </tr>
  <tr id="section-Custom_asymmetric_equality_tester">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Custom_asymmetric_equality_tester">&#182;</a>
      </div>
      <h3>Custom asymmetric equality tester</h3>

<p>When you need to check that something meets a certain criteria, without being strictly equal, you can also specify a custom asymmetric equality tester simply by providing an object that has an <code>asymmetricMatch</code> function.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    describe("custom asymmetry", function() {
        const tester = {
            asymmetricMatch: function(actual) {
                const secondValue = actual.split(',')[1];
                return secondValue === 'bar';
            }
        };

        it("dives in deep", function() {
            expect("foo,bar,baz,quux").toEqual(tester);
        });

        describe("when used with a spy", function() {
            it("is useful for comparing arguments", function() {
                const callback = jasmine.createSpy('callback');

                callback('foo,bar,baz');

                expect(callback).toHaveBeenCalledWith(tester);
            });
        });
    });
});
```
</div>
    </td>
  </tr>
  <tr id="section-Jasmine_Clock">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Jasmine_Clock">&#182;</a>
      </div>
      <h2>Jasmine Clock</h2>

<p>The <a href="/api/edge/Clock.html">Jasmine Clock</a> is available for testing time dependent code.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("Manually ticking the Jasmine Clock", function() {
    let timerCallback;
```
</div>
    </td>
  </tr>
  <tr id="section-37">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-37">&#182;</a>
      </div>
      <p>It is installed with a call to <code>jasmine.clock().install</code> in a spec or suite that needs to manipulate time.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    beforeEach(function() {
        timerCallback = jasmine.createSpy("timerCallback");
        jasmine.clock().install();
    });
```
</div>
    </td>
  </tr>
  <tr id="section-38">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-38">&#182;</a>
      </div>
      <p>Be sure to uninstall the clock after you are done to restore the original functions.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    afterEach(function() {
        jasmine.clock().uninstall();
    });
```
</div>
    </td>
  </tr>
  <tr id="section-Mocking_the_JavaScript_Timeout_Functions">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Mocking_the_JavaScript_Timeout_Functions">&#182;</a>
      </div>
      <h3>Mocking the JavaScript Timeout Functions</h3>

<p>You can make <code>setTimeout</code> or <code>setInterval</code> synchronous executing the registered functions only once the clock is ticked forward in time.</p>

<p>To execute registered functions, move time forward via the <code>jasmine.clock().tick</code> function, which takes a number of milliseconds.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("causes a timeout to be called synchronously", function() {
        setTimeout(function() {
            timerCallback();
        }, 100);

        expect(timerCallback).not.toHaveBeenCalled();

        jasmine.clock().tick(101);

        expect(timerCallback).toHaveBeenCalled();
    });

    it("causes an interval to be called synchronously", function() {
        setInterval(function() {
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
```
</div>
    </td>
  </tr>
  <tr id="section-Mocking_the_Date">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Mocking_the_Date">&#182;</a>
      </div>
      <h3>Mocking the Date</h3>

<p>The Jasmine Clock can also be used to mock the current date.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    describe("Mocking the Date object", function(){
        it("mocks the Date object and sets it to a given time", function() {
            const baseTime = new Date(2013, 9, 23);
```
</div>
    </td>
  </tr>
  <tr id="section-41">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-41">&#182;</a>
      </div>
      <p>If you do not provide a base time to <code>mockDate</code> it will use the current date.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
            jasmine.clock().mockDate(baseTime);

            jasmine.clock().tick(50);
            expect(new Date().getTime()).toEqual(baseTime.getTime() + 50);
        });
    });
});
```
</div>
    </td>
  </tr>
  <tr id="section-Asynchronous_Support">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-Asynchronous_Support">&#182;</a>
      </div>
      <h2>Asynchronous Support</h2>

<p>Jasmine also has support for running specs that require testing asynchronous
  operations. The functions that you pass to <code>beforeAll</code>,
  <code>afterAll</code>, <code>beforeEach</code>, <code>afterEach</code>, and
  <code>it</code> can be declared <code>async</code>.</p>
<p>Jasmine also supports asynchronous functions that explicitly return
  promises or that take a callback. See the <a href="async">Asynchronous
  Work tutorial</a> for more information.</p>
</td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("Using async/await", function() {
    beforeEach(async function() {
        await soon();
        value = 0;
    });
```
</div>

    </td>
  </tr>
  <tr id="section-52">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-52">&#182;</a>
      </div>
      <p>This spec will not start until the promise returned from the call to <code>beforeEach</code> above is settled. And this spec will not complete until the promise that it returns is settled.</p>
    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
    it("supports async execution of test preparation and expectations",
        async function() {
            await soon();
            value++;
            expect(value).toBeGreaterThan(0);
        }
    );
});
```
</div>
    </td>
  </tr>
  <tr id="section-53">
    <td class="docs">
      <div class="pilwrap">
        <a class="pilcrow" href="#section-53">&#182;</a>
      </div>
      <p>By default jasmine will wait for 5 seconds for an asynchronous spec to finish before causing a timeout failure.
If the timeout expires before <code>done</code> is called, the current spec will be marked as failed and suite execution will continue as if <code>done</code> was called.</p>

<p>If specific specs should fail faster or need more time this can be adjusted by passing a timeout value to <code>it</code>, etc.</p>

<p>If the entire suite should have a different timeout, <code>jasmine.DEFAULT_TIMEOUT_INTERVAL</code> can be set globally, outside of any given <code>describe</code>.</p>

    </td>
    <td class="code">
<div class="highlight" markdown="1">
```javascript
describe("long asynchronous specs", function() {
    beforeEach(async function() {
        await somethingSlow();
    }, 1000);

    it("takes a long time", function() {
        await somethingReallySlow();
    }, 10000);

    afterEach(function() {
        await somethingSlow();
        }, 1000);
    });

    function soon() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, 1);
        });
    }
});
```
</div>
    </td>
  </tr>
  </tbody>
</table>
