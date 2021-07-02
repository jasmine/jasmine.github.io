---
question: What does Jasmine use to test itself?
slug: self-test
---

Jasmine uses Jasmine to test Jasmine.

Jasmine's test suite loads two copies of Jasmine. The first is loaded from the
built files in `lib/`. The second, called `jasmineUnderTest`, is loaded directly
from the source files in `src/`. The first Jasmine is used to run the specs, and
the specs call functions on `jasmineUnderTest`.

This has several advantages:

* Developers get feedback on the design of Jasmine by using it to develop
  Jasmine.
* Developers can choose whether to test against the last committed version of
  Jasmine (by doing nothing) or against the current code (by doing a build 
  first).
* It's not possible to get stuck in a state where Jasmine's tests don't run 
  because of a newly introduced bug in Jasmine. Developers can avoid that
  situation by not building until the specs are green, and get out of it by
  simply running `git checkout lib`.
* Because no build step is required, it can take less than two seconds to go
  from saving a file to seeing the results of a test run.
  
If you're curious about how this is set up, see
[requireCore.js](https://github.com/jasmine/jasmine/blob/main/src/core/requireCore.js) and
[defineJasmineUnderTest.js](https://github.com/jasmine/jasmine/blob/main/spec/helpers/defineJasmineUnderTest.js).
