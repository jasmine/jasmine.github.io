---
question: How do I test async behavior that I don't have a promise or callback for, like a UI component that renders something after fetching data asynchronously?
---

There are two basic ways to approach this. The first is to cause the async
behavior to complete immediately (or as close to immediately as possible) and
then `await` in the spec. Here's an example of that approach using the
[enzyme](https://www.npmjs.com/package/enzyme) and
[jasmine-enzyme](https://www.npmjs.com/package/jasmine-enzyme) libraries to
test a React component:


```javascript
describe('When data is fetched', () => {
  it('renders the data list with the result', async () => {
    const payload = [/*...*/];
    const apiClient = {
      getData: () => Promise.resolve(payload);
    };

    // Render the component under test
    const subject = mount(<DataLoader apiClient={apiClient} />);
    
    // Wait until after anything that's already queued
    await Promise.resolve();
    subject.update();

    const dataList = subject.find(DataList);
    expect(dataList).toExist();
    expect(dataList).toHaveProp('data', payload);
  });
});
```

Note that the promise that the spec awaits is unrelated to the one passed to
the code under test. People often use the same promise in both places, but that
doesn't matter as long as the promise passed to the code under test is already
resolved. The important thing is that the `await` call in the spec happens
after the one in the code under test.

This approach is simple, efficient, and fails quickly when things go wrong. But
it can be tricky to get the scheduling right when the code under test does more
than one `await` or `.then()`. Changes to the async operations in the code
under test can easily break the spec, requiring the addition of extra `await`s.

The other approach is to poll until the desired behavior has happened:


```javascript
describe('When data is fetched', () => {
  it('renders the data list with the result', async () => {
    const payload = [/*...*/];
    const apiClient = {
      getData: () => Promise.resolve(payload);
    };

    // Render the component under test
    const subject = mount(<DataLoader apiClient={apiClient} />);

    // Wait until the DataList is rendered
    const dataList = await new Promise(resolve => {
      function poll() {
        subject.update();
        const target = subject.find(DataList);

        if (target.exists()) {
          resolve(target);
        } else {
          setTimeout(poll, 50);
        }
      }
      poll();
    });
    
    expect(dataList).toHaveProp('data', payload);
  });
});
```

This is a bit more complex at first and can be slightly less efficient. It will
also time out (after 5 seconds by default) rather than failing immediately if
the expected component is not rendered. But it's more resilient in the face of
change. It will still pass if more `await`s or `.then()` calls are added to the
code under test.

You might find
[DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro)
or
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
helpful when writing specs in the second style. The `findBy*` and `findAllBy*`
queries in both those libraries implement the polling behavior shown above.
