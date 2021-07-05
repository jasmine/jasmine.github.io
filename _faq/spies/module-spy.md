---
question: How can I spy on a property of a module? I'm getting an error like "Property aProperty does not have access type get".
---

<div class="warning">Note: This FAQ deals with a rapidly changing area and
may become out of date. It was last updated in July 2021.</div>

This error means that something (probably a transpiler, but possibly the
JavaScript runtime) has marked the exported properties of the module as
read-only. The ES module spec requires that exported module properties be
read-only, and recently transpilers like TypeScript have moved to conform to
that requirement even when emitting CommonJS modules. If a property is marked
read-only, Jasmine can't replace it with a spy.

There are three ways to work around the problem:

1. Use dependency injection for things you'll want to mock, and inject a spy
or a mock object from the spec. This approach usually results in maintainability
improvements in the specs and the code under test. Needing to mock modules is
often a sign of tightly coupled code, and it can be wise to fix the coupling
rather than work around it with testing tools.
2. Use CommonJS modules without a transpiler.
3. If you're running your specs on Node, you can monkey-patch the Node module
loader to make exported properties writeable. Doing this involves interacting
with Node APIs that are currently marked as unstable, so it's a good idea to
use a library that takes care of it for you. Examples include
[testdouble](https://github.com/testdouble/testdouble.js/blob/main/docs/7-replacing-dependencies.md)
and [rewire](https://www.npmjs.com/package/rewire). Be prepared for the 
possibility that things will break when you upgrade Node.
