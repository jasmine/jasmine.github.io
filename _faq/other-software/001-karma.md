---
question: Can I use Jasmine 5.x with Karma?
---

Probably. Karma-jasmine 5.1 (the latest version as of this writing, and likely 
the final version) appears to be compatible with jasmine-core 5.x. You should
be able to
[use an NPM override to override karma-jasmine's dependency specification](https://github.com/dfederm/karma-jasmine-html-reporter/issues/74#issuecomment-1576032674).