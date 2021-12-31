---
layout: faq # FAQ styling for lists and code blocks is right for this page
---

<h1>Upgrading to Jasmine 4.0</h1>

<div class="warning">
	This is a rough draft that describes an unreleased version of Jasmine.
	Things will change between the time you read this and the final release.
</div>

<h2>Overview</h2>

**tl;dr**: Update to 3.99 and fix any deprecation warnings before updating to 4.0.

We think that Jasmine 4.0 will be an easy upgrade for most users. However,
it does contain a number of breaking changes and some people will need to
make changes to their code in order to upgrade. Following the steps in this
guide will give you the greatest chance of a smooth upgrade experience.

Breaking changes in Jasmine 4.0 include changes to how Jasmine is configured,
changes to custom matchers and asymmetric equality testers, better detection
of common errors, and changes to the system requirements. You can find a
complete list of breaking changes in the 
[release notes](https://github.com/jasmine/jasmine/blob/main/release_notes/4.0.0.md).


<h2>Contents</h2>

<ol>
  <li><a href="#system-requirements">System requirements</a></li>
  <li><a href="#using-jasmine-3-99-to-detect-compatibility-problems">Using Jasmine 3.99 to detect compatibility problems</a></li>
  <li><a href="#migration-path-for-ruby-and-python-users">Migration path for Ruby and Python users</a></li>
  <li><a href="#jasmine-package-public-interface" markdown="1">`jasmine` package public interface</a></li>
  <li><a href="#exit-code-changes">Exit code changes</a></li>
  <li><a href="#changes-to-how-beforeall-and-beforeeach-failures-are-handled">Changes to how beforeAll and beforeEach failures are handled</a></li>
  <li><a href="#reporter-interface-changes">Reporter interface changes</a></li>
  <li><a href="#tips-for-resolving-specific-deprecation-warnings">Tips for resolving specific deprecation warnings</a></li>
</ol>

<h2>System requirements</h2>

The following previously-supported environments are no longer supported:
[ TODO: Update shortly before release. ]

* Node <12.17
* Internet Explorer
* Firefox 68 and 78
* Safari 8-13
* PhantomJS
* Python
* Ruby
* Bower

Odd-numbered Node versions (13.x, 15.x, 17.x) are unsupported and may or may
not work. In particular, some 13.x versions have incomplete support for
ES/CommonJS module interop and can't run Jasmine 4.0.

<h2>Using Jasmine 3.99 to detect compatibility problems</h2>

Jasmine 3.99 issues deprecation warnings for most code that uses APIs that are
removed or changed in incompatible ways in 4.0. We recommend upgrading to 3.99
and fixing all deprecation warnings before upgrading to 4.0. You should upgrade
the Jasmine packages that you depend on directly, as usual. If you upgrade the
`jasmine` NPM package, the `jasmine` Rubygem, or the `jasmine` Python package to
3.99, you'll also get version 3.99 of jasmine-core.

If you're using jasmine-browser-runner, just add `jasmine-core` 3.99 to your
dependencies.

<h2>Migration path for Ruby and Python users</h2>

3.99 is the final version of Jasmine for Ruby and Python. We recommend that most
users migrate to the [jasmine-browser-runner](https://github.com/jasmine/jasmine-browser)
NPM package, which is the direct replacement for the `jasmine` Ruby gem and 
Python package. It runs your specs in browsers, including headless Chrome and
Saucelabs. It works with Rails applications including those that use Webpacker,
which was never supported by the `jasmine` gem.

If `jasmine-browser-runner` doesn't meet your needs, one of these might:

* The [jasmine](https://github.com/jasmine/jasmine-npm) NPM package to run
specs in Node.js.
* The [standalone distribution](https://github.com/jasmine/jasmine#installation)
to run specs in browsers with no additional tools.
* The [jasmine-core](https://github.com/jasmine/jasmine) NPM package if all
you need is the Jasmine assets. This is the direct equivalent of the
`jasmine-core` Ruby gem and Python package.

<h2 markdown="1">`jasmine` package public interface</h2>

Unlike the `jasmine-core` pacakge, the `jasmine` package did not have a
documented public interface until version 3.8. Beginning with 4.0, anything
that's not part part of the documented public interface will be considered a
private API and subject to change at any time. If you use the `jasmine` package
programmatically (i.e. you have code that does `require('jasmine'`) or
`import('jasmine')`, please check your code against the
[API docs](https://jasmine.github.io/api/npm/4.0/Jasmine).

<h2>Exit code changes</h2>

Prior to version 4, the `jasmine` command exited with a status of 1 in almost
all scenarios other than complete success. Version 4 uses different exit codes
for different types of failures. You don't need to change anything unless your
build or CI system specifically checks for an exit code of 1 (this is very
unusual). Anything that treats 0 as success and everything else as failure will
still work.

<h2 markdown="1">Changes to how `beforeAll` and `beforeEach` failures are handled</h2>

Jasmine 4 handles `beforeAll` and `beforeEach` failures differently. The change
may cause problems with certain unusual setup and teardown patterns. As long as
you tear down resources in the same suite where they were set up, you don't
need to make any changes.

When a `beforeAll` function fails for any other reason other than a failed
expectation, Jasmine 4 will skip the entire suite except for any `afterAll`
functions defined in the same suite as the failed `beforeAll`. Similarly, a
`beforeEach` failure other than a failed expectation will cause any subsequent
`beforeEach` functions, the spec in question, and any `afterEach` functions
defined in nested suites to be skipped.

```
// Unsafe. Test pollution can result because the afterEach won't always run.
describe('Outer suite', function() {
  beforeEach(function() {
    setSomeGlobalState();
    possiblyFail();
  });

  describe('inner suite', function() {
    it('does something', function() { /*...*/ });

    // This afterEach function should be moved up to the outer suite.
    afterEach(function() {
      cleanUpTheGlobalState();
    });
  });
});
```

<h2>Reporter interface changes</h2>

Jasmine 4.0 adds a `debugLogs` field to the
[object that's passed to a reporter's specDone method]({{site.url}}/api/edge/global.html#SpecResult).
It will be defined if the spec called
[jasmine.debugLog]({{site.url}}/api/edge/jasmine.html#.debugLog)
and also failed. Most reporters should display it if it's present.

Jasmine 4.0 is more likely than previous versions to report errors in the
`jasmineDone` event. Failing to display those errors is a common bug in custom
reporters. You can check yours by creating an `afterAll` function at the top
level (i.e. not in a `describe`) that throws an exception and making sure that
your reporter displays it.


<h2>Tips for resolving specific deprecation warnings</h2>

<h3 id="matchers-cet">Deprecations related to custom equality testers in matchers</h3>

* "The matcher factory for [name] accepts custom equality testers, but this
  parameter will no longer be passed in a future release"
* "Passing custom equality testers to MatchersUtil#contains is deprecated."
* "Passing custom equality testers to MatchersUtil#equals is deprecated."
* "Diff builder should be passed as the third argument to MatchersUtil#equals,
  not the fourth."

Prior to 3.6, [custom matchers]({{ site.github.url }}/tutorials/custom_matcher)
that wanted to support [custom equality testers]({{ site.github.url }}/tutorials/custom_equality)
had to accept an array of custom equality testers as the matcher factory's 
second argument and pass it to methods like `MatchersUtil#equals` and
`MatchersUtil#contains`. Since 3.6, the `MatchersUtil` instance passed to the
matcher factory is preconfigured with the current set of custom equality
testers, and matchers do not need to provide the. Beginning with Jasmine 4.0,
custom equality testers are neither passed to the matcher factory nor accepted
as parameters to `MatchersUtil` methods. To update your custom matchers to the
new style, simply remove the extra parameter from the matcher factory and stop
passing it to `MatchersUtil` methods.

Before:

```
jasmine.addMatchers({
  toContain42: function(matchersUtil, customEqualityTesters) {
    return {
      compare: function(actual, expected) {
        return {
          pass: matchersUtil.contains(actual, 42, customEqualityTesters)
        };
      }
    };
  }
});
```


After:

```
jasmine.addMatchers({
  toContain42: function(matchersUtil) {
    return {
      compare: function(actual, expected) {
        return {
          pass: matchersUtil.contains(actual, 42)
        };
      }
    };
  }
});
```

<h4>Note to library authors</h4>

The updated form above is only compatible with Jasmine 3.6 and newer. If you
want to maintain compatibility with older versions of Jasmine, you can avoid the
deprecation warnings by declaring the matcher factory to take a single argument
and then using the `arguments` object or
[rest parameter syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
to access the array of custom equality testers. Then check for a `deprecated`
property on the array, which will be present in Jasmine 3.6 and later, before
passing it along:

````
jasmine.addMatchers({
  toContain42: function(matchersUtil, ...extraArgs) {
    const customEqualityTesters = 
      extraArgs[0] && !extraArgs[0].deprecated ? extraArgs[0] : undefined;
    
    return {
      compare: function(actual, expected) {
        return {
          pass: matchersUtil.contains(actual, 42, customEqualityTesters)
        };
      }
    };
  }
});
````

<h3 id="asymmetricMatch-cet">"The second argument to asymmetricMatch is now a
MatchersUtil. Using it as an array of custom equality testers is deprecated and
will stop working in a future release."</h3>

Prior to 3.6, [custom asymmetric equality testers]({{ site.github.url }}/tutorials/custom_asymmetric_equality_testers)
that wanted to support [custom equality testers]({{ site.github.url }}/tutorials/custom_equality)
had to accept an array of custom equality testers as second argument to
`asymmetricMatch` and pass it to methods like `MatchersUtil#equals` and
`MatchersUtil#contains`. From 3.6, to 3.99, the second argument is both an
array of custom equality testers and a `MatchersUtil` instance that's
preconfigured with them. In 4.0 and later it's just a properly configured
`MatchersUtil`. To resolve the deprecation warning, use the provided
`MatchersUtil` directly:

Before:

```
function somethingContaining42() {
  return {
    asymmetricMatch: function(other, customEqualityTesters) {
      return jasmine.matchersUtil.contains(other, 42, customEqualityTesters);
    }
  };
}
```


After:

```
function somethingContaining42() {
  return {
    asymmetricMatch: function(other, matchersUtil) {
      return matchersUtil.contains(other, 42);
    }
  };
}
```

<h4>Note to library authors</h4>

The updated form above is only compatible with Jasmine 3.6 and newer. If you
want to maintain compatibility with older versions of Jasmine, you can avoid the
deprecation warnings by checking whether the second argument is a `MatchersUtil`
(e.g. by checking for an `equals` method) and falling back to the old form above
if it isn't a `MatchersUtil`.


<h3 id="static-utils">Deprecations related to matcher utilities that are no 
longer available globally</h3>

* "jasmine.matchersUtil is deprecated and will be removed in a future release.
  Use the instance passed to the matcher factory or the asymmetric equality 
  tester's `asymmetricMatch` method instead."
* "jasmine.pp is deprecated and will be removed in a future release. Use the 
  pp method of the matchersUtil passed to the matcher factory or the asymmetric
  equality tester's `asymmetricMatch` method instead."

Until Jasmine 4.0 there was a static `MatchersUtil` instance available as
`jasmine.matchersUtil` and a static pretty printer available as `jasmine.pp`. 
Because both of those now carry configuration that's specific to the current
spec, it no longer makes sense to have static instances. Instead of using 
`jasmine.matchersUtil`, access the current `MatchersUtil` in one of the 
following ways:

* [The first parameter to a matcher factory]({{ site.github.url}}/tutorials/custom_matcher)
* [The second parameter to an asymmetric equality tester's `asymmetricMatch` method]({{ site.github.url }}/api/edge/AsymmetricEqualityTester.html#asymmetricMatch)

Instead of using `jasmine.pp`, access a `matchersUtil` in either of the above
ways and then use its [pp method]({{ site.github.url }}/api/edge/MatchersUtil.html#pp).

Also, if an object has a `jasmineToString` method, `pp` will be passed as the
first parameter.

<h4>Note to library authors</h4>

`matchersUtil` is provided to matcher factories in all versions since 2.0, and
to asymmetric equality testers in all versions since 2.6. `matchersUtil#pp` was
introduced in 3.6, which is also the first version that passed a pretty-printer
to `jasmineToString`. If you need to pretty-print in a way that's compatible with
Jasmine versions older than 3.6, you can check for a `pp` method on the 
`matchersUtil` instance or a parameter passed to `jasmineToString` and then 
fall back to `jasmine.pp` if it isn't there.


<h3>Deprecations related to mixing two forms of async</h3>


* "An asynchronous before/it/after function was defined with the async 
  keyword but also took a done callback. This is not supported and will stop 
  working in the future. Either remove the done callback (recommended) or remove
  the async keyword."
* "An asynchronous before/it/after function took a done callback but also 
  returned a promise. This is not supported and will stop working in the future.
  Either remove the done callback (recommended) or change the function to not 
  return a promise."

Jasmine never supported functions that combine multiple forms of async, and
they never had a consistent or well-defined behavior. Jasmine 4.0 will issue a
spec failure whenever it encounters such a function.
[The FAQ discusses the reason for this change and how to update your specs]({{ site.github.url}}/pages/faq.html#010-mixed-style).


<h3 markdown="1">Deprecations due to calling `done` multiple times</h3>

* "An asynchronous function called its 'done' callback more than once. This is
  a bug in the spec, beforeAll, beforeEach, afterAll, or afterEach function in
  question. This will be treated as an error in a future version."
* "A top-level beforeAll or afterAll function called its 'done' callback more
  than once. This is a bug in the beforeAll or afterAll function in question.
  This will be treated as an error in a future version."

Jasmine historically tolerated multiple `done` calls, but the bugs that this
masked proved to be a common source of confusion. Jasmine 4 will report an
error whenever an asynchronous function calls `done` more than once.
[The FAQ discusses the reason for this change and how to update your specs]({{ site.github.url}}/pages/faq.html#012-done-twice).
