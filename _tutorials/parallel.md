---
layout: article
title: Parallel Execution
omit_from_index: true
---
<div class="warning">
    This document describes unreleased functionality that is incomplete and has
    both known and unknown bugs. There may be additional breaking changes that
    affect this functionality between now and the final release of Jasmine 5.0.
</div>

# Parallel Support

Support for parallel execution in Node.js is being developed on the 5.0 branch.
Although parallel support is not entirely complete or production-quality, it's good
enough to run Jasmine's own test suite. It might also be ready for use by
adventurous people with well-behaved test suites who are willing to dig in and
help diagnose any bugs that they encounter.

To try out parallel mode:

1. Read the lists of limitations and bugs below and make sure none of them apply
   to you. In particular, make sure that you don't have to disable
   randomization, specify a random seed, or specify a custom order to make your
   suite run reliably.
2. Set your `jasmine` dependency to `github:jasmine/jasmine-npm#5.0`.
3. If you depend on `jasmine-core` directly or via any package other than
   `jasmine`, set your `jasmine-core` dependency to `github:jasmine/jasmine#5.0`.
4. Add the `--num-workers=<n>` argument to your `jasmine` command, e.g.
   `jasmine --num-workers=4` to run specs in four parallel processes.

The ideal number of workers depends on the nature of your specs and the number
and type of available CPU cores. CPU bound suites will often run fastest if the
number of workers is slightly less than the number of cores. I/O bound suites
may benefit from a lower number of workers.


## Limitations

The following limitations apply only to parallel mode, not to the normal
sequential execution mode.

* Randomization can't be disabled, and the random seed can't be set.
* `fit` and `fdescribe` are not supported.
* Calls to `beforeEach` and `afterEach` at the top level of a spec file are not
  supported. Calls to those functions in a helper file or inside a `describe`
  are fully supported.
* Calls to `beforeAll` and `afterAll` are only supported inside of `describe`.
  If you need to perform exactly-once initialization of out-of-process state,
  such as starting a database or other external service, see the new global
  setup/teardown API described below.
* Reporters that don't come with Jasmine will need to be updated to work in 
  parallel mode. See the section on reporters below for more information.
* `Env` methods that change state, such as `addReporter`, `configure`, etc. are 
  not supported. Use configuration, CLI arguments, or equivalent methods on the
  `ParallelRunner` class instead.
* The `specFilter` core configuration property is not supported, because it's
  not possible to send functions to another process. Use the `--filter=` CLI
  option or pass the filter as the second parameter to `ParallelRunner#execute`
  instead.

## New global setup/teardown API

Jasmine 5.0 offers a new API for exactly-once global setup and teardown. It is
intended to support parallel execution scenarios that require out-of-process
setup to be done once regardless of the number of workers. It can also be used
in the normal sequential execution mode.

To use the global setup/teardown API, add `globalSetup` and/or `globalTeardown`
functions to your Jasmine configuration, e.g.:

```
module.exports = {
  spec_dir: "spec",
  // ...
  globalSetup() {
    // ... your setup code here
  }
  globalTeardown() {
    // ... your teardown code here
  }
}
```

If a global setup/teardown function is declared `async` or otherwise returns a
promise, Jasmine will wait for the returned promise to be resolved before
continuing. Callback-style async is not supported.

## Known bugs as of 2023-02-12:

* Errors thrown by reporters are not handled properly.
* Unhandled async errors that occur after a spec finishes are somewhat less
  likely to be reported.
* [Use without globals](tutorials/use_without_globals) is not yet supported.
* Programmatic usage is possible, but not yet documented.

## Differences to be aware of

* Certain types of fatal errors, like errors loading a spec or helper file,
  occur before the `jasmineStarted` reporter event in sequential mode and after
  it in parallel mode.
* Because multiple specs run at the same time, it might be difficult or
  impossible to debug via `console.log` in parallel mode. We recommend using
  sequential mode when debugging.
* The `--fail-fast` CLI option and `stopOnSpecFailure` config setting are
  supported on a best-effort basis. Execution will stop as soon as practical
  after the first failure.

## Updating reporters to work in parallel mode

Parallel mode imposes a number of limitations on reporters. Since most 
non-trivial reporters will need some changes to work in parallel mode, Jasmine 
assumes that a reporter is incompatible with parallel mode unless it declares
compatibility. A reporter can declare that it is compatible with parallel mode
by exposing a `reporterCapabilities` property with value `{parallel: true}`.

The biggest limitation to be aware of is that events are delivered as they are
received from worker processes, which means that events for unrelated specs and
suites can interleave. A reporter that assumes that a `specDone` event is for
the same spec as the most recently received `specStarted` event, or that all
events between a `suiteStarted` and `suiteDone` event relate to children of that
suite, will not work in parallel mode. Jasmine makes only the following 
guarantees about event ordering in parallel mode:

* `jasmineStarted` is reported before all other events.
* `jasmineDone` is reported after all other events.
* `specStarted` is reported before the `specDone` event for the same spec.
* `suiteStarted` is reported before the `suiteDone` event for the same suite.
* All events for a suite's children will be reported after the suite's
  `suiteStarted` event and before its `suiteDone` event.

In sequential mode, Jasmine waits for asynchronous reporter functions to
complete before continuing. In parallel mode, it does not. Async reporters
should be prepared to process events concurrently.

In addition, several APIs used by reporters are missing or limited:
* `Env#topSuite` is not supported.
* The `jasmineStarted` reporter event does not have the `totalSpecsDefined` or
  `order` fields.
* The `JasmineDoneInfo` reporter event does not have the `order` field.

Note that all of the above applies only to parallel mode. In the normal
sequential mode, Jasmine 5 is fully compatible with existing reporters.