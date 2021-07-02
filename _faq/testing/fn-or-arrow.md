---
question: Should I pass regular functions or arrow functions to <code>describe</code>, <code>it</code>, <code>beforeEach</code>, etc?
---

For `describe`, it doesn't matter. For `it`, `beforeEach`, and `afterEach`,
you might prefer to use regular functions. Jasmine creates a
[user context]({{ site.github.url }}/tutorials/your_first_suite#section-The_%3Ccode%3Ethis%3C%2Fcode%3E_keyword)
and passes it as `this` to each `it`, `beforeEach` and `afterEach` function.
This allows you to easily pass variables between those functions and be sure
that they will be cleaned up after each spec. However, that doesn't work with
arrow functions, because `this` in an arrow function is lexically bound. So if
you want to use user contexts, you have to stick to regular functions.
