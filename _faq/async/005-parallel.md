---
question: How can I stop Jasmine from running my specs in parallel?
---

Jasmine doesn't actually support parallel execution. It runs one spec (or
before/after) function at a time. However, it depends on those user-provided
functions to indicate when they're done. If a function signals completion
before it (or the code under test that it triggered) is actually done, then
the execution of the next spec will interleave with it. To fix this, make sure
each asynchronous function calls its callback or resolves or rejects	the
returned promise only when it's completely finished. See the
[async tutorial]({{ site.github.url }}/tutorials/async) for more information.
