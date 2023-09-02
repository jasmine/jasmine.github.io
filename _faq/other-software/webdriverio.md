---
question: Why doesn't expect() work right in webdriver.io?
---

`@wdio/jasmine-framework` replaces Jasmine's `expect` with
a different one that is incompatible with Jasmine's. See
[the Webdriver.IO docs](https://webdriver.io/docs/api/expect-webdriverio/)
for information about its `expect` API.

In addition to replacing `expect`, Webdriver.IO monkey patches some Jasmine
internals. Bugs that only occur when Webdriver.IO is present should be reported
to Webdriver.IO, not to Jasmine.