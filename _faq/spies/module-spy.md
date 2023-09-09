---
question: How can I spy on a property of a module? I'm getting an error like "aProperty does not have access type get", "is not declared writable or has no setter", or "is not declared configurable".
---

<div class="warning">Note: This FAQ deals with a rapidly changing area and
may become out of date. It was last updated in September 2023.</div>

This error means that something (probably a transpiler, but possibly the
JavaScript runtime) has marked the exported properties of the module as
read-only. The ES module spec requires that exported module properties be
read-only, and some transpilers conform to
that requirement even when emitting CommonJS modules. If a property is marked
read-only, Jasmine can't replace it with a spy.

Regardless of the environment you're in, you can avoid the problem by using
dependency injection for things you'll want to mock and injecting a spy or a 
mock object from the spec. This approach usually results in maintainability
improvements in the specs and the code under test. Needing to mock modules is
often a sign of tightly coupled code, and it can be wise to fix the coupling
rather than work around it with testing tools.

Depending on the environment you're in, it may be possible to enable module 
mocking. See the <a href="/tutorials/module_mocking">module mocking guide</a>
for more information.
