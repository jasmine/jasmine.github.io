---
question: Why can't I spy on localStorage methods in some browsers? What can I do instead?
---

This will pass in some browsers but fail in Firefox and Safari 17:

```javascript
it('sets foo to bar on localStorage', function() {
    spyOn(localStorage, 'setItem');
    localStorage.setItem('foo', 'bar');
    expect(localStorage.setItem).toHaveBeenCalledWith('foo', 'bar');
});
```

As a security measure, Firefox and Safari 17 don't allow properties of 
`localStorage` to be overwritten. Assigning to them, which is what `spyOn` does
under the hood, is a no-op. This is a limitation imposed by the browser and 
there is no way for Jasmine to get around it.

One alternative is to check the state of `localStorage` rather than verifying
what calls were made to it:

```javascript
it('sets foo to bar on localStorage', function() {
   localStorage.setItem('foo', 'bar');
   expect(localStorage.getItem('foo')).toEqual('bar');
});
```

Another option is to create a wrapper around `localStorage` and mock the wrapper.