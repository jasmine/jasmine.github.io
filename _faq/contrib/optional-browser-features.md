---
question: How do I work on a feature that depends on something that's missing from some supported browsers, like an async matcher or equality comparison for Sets?
---

We try to make all features of Jasmine available on all supported browsers and
Node versions, but sometimes that doesn't make sense. For instance, async
matchers aren't possible or useful in environments that don't have promises.
In these cases, the important thing is that the new functionality doesn't break
anything on older browsers.

To write a spec for something that won't work in all environments, check
whether the required language/runtime features are present and mark the spec
pending if they're not. See
[spec/helpers/checkForUrl.js](https://github.com/jasmine/jasmine/blob/main/spec/helpers/checkForUrl.js)
and the uses of the `requireUrls` function that it defines for an example of
how to do this.

See the is\* methods in
[src/core/base.js](https://github.com/jasmine/jasmine/blob/main/src/core/base.js)
for examples of how to safely check whether an object is an instance of a type
that might not exist.

Users can provide their own Promise implementation via
[Env#configure]({{ site.github.url }}/api/edge/Env.html#configure), regardless of whether the
environment has built-in Promise support. If you're writing code that creates
new promises, be sure to use the configured Promise constructor if there is
one.
