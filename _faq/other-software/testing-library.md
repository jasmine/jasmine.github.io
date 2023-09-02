---
question: How can I use Jasmine matchers with testing-library's waitFor function?
---

Use `throwUnless` instead of `expect`:

```
await waitFor(function() {
    throwUnless(myDialogElement).toHaveClass('open');
});
```