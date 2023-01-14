---
question: Why does Jasmine allow multiple expectation failures in a spec? How can I disable that?
---

Sometimes it takes more than one expectation to assert a particular result. In
those situations it can be helpful to see all of the expectations fail before
trying to make any of them pass. This is particularly useful when a single code
change will make multiple expectations pass.

If you want each spec to stop at the first expectation failure, you can set the
`oneFailurePerSpec` option to `true`:

* If you're using the standalone distribution, click "Options" and then "stop
  spec on expectation failure", or edit `boot.js` to set the option permanently.
* If you're using the `jasmine` NPM package, set
  `stopSpecOnExpectationFailure` to `true` in your config file (usually 
  `spec/support/jasmine.json`).
* If you're using a third party tool that wraps jasmine-core, check that tool's
  documentation for how to pass configuration options.
* If you're using jasmine-core directly, add it to the object that you pass to
  [Env#configure]({{ site.github.url }}/api/edge/Env.html#configure).

Note that any afterEach or afterAll functions associated with the spec will
still run.
