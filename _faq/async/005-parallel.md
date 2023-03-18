---
question: How can I stop Jasmine from running my specs in parallel?
---

Jasmine only runs specs in parallel if you use at least version 5.0 of the
`jasmine` NPM package and pass the `--parallel` command line argument. In
all other configurations it runs one spec (or
before/after) function at a time. Even the parallel configuration runs specs and
before/after functions within each suite sequentially.

However, Jasmine depends on those user-provided
functions to indicate when they're done. If a function signals completion
before it's actually done, then
the execution of the next spec will interleave with it. To fix this, make sure
each asynchronous function calls its callback or resolves or rejects the
returned promise only when it's completely finished. See the
[async tutorial]({{ site.github.url }}/tutorials/async) for more information.
