---
question: How can I get Jasmine to fail specs that don't have any assertions?
---

By default, Jasmine doesn't require specs to contain any expectations. You can
enable that behavior by setting the `failSpecWithNoExpectations` option to
`true`:

* If you're using the standalone distribution, add it to the `config` object
  in `lib/jasmine-<VERSION>/boot.js`.
* If you're using the `jasmine` NPM package, add it to your config file
  (usually `spec/support/jasmine.json`).
* If you're using a third party tool that wraps jasmine-core, check that tool's
  documentation for how to pass configuration options.
* If you're using jasmine-core directly, add it to the object that you pass to
  [Env#configure]({{ site.github.url }}/api/edge/Env.html#configure).

We don't recommend relying on the `failSpecWithNoExpectations` option.
All it ensures is that each spec has at least one expectation, not
that the spec will actually fail for the right reason if the behavior it's
trying to verify doesn't work. The only way to be sure that a spec is actually
correct is to try it both ways and see that it passes when the code under test
is working and fails in the intended way when the code under test is broken.
Very few people can consistently write good specs without doing that, just like
very few people can consistently deliver working non-test code without trying
it out.
