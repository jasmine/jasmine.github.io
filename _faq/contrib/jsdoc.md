---
question: When should I write JSDoc comments? When shouldn't I?
---

JSDoc comments (the ones that start with `/**`) should be used for everything
that's part of the public interface. They should not be used for anything else.

The API reference documentation on this website is automatically generated from
JSDoc comments. So adding a JSDoc comment to something has the effect of making
it part of the documented public API. Do not add JSDoc comments to internal 
interfaces. If you want, you can write a comment that looks like JSDoc but
doesn't start with `/**`. But it's usually better to use plain English since 
those comments don't need to be machine-readable.