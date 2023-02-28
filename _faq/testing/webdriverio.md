---
question: Why doesn't expect() work right in webdriver.io?
---

Webdriver.IO monkey patches Jasmine extensively. In particular, 
`@wdio/jasmine-framework` replaces Jasmine's `expect` with 
[a different one](https://webdriver.io/docs/api/expect-webdriverio/) that is
incompatible with Jasmine's.
