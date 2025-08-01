---
question: Does Jasmine support parameterized testing?
---

Not directly. But test suites are just JavaScript, so you can do it anyway.

```javascript
function add(a, b) {
    return a + b;
}

describe('add', function() {
    const cases = [
        {first: 3, second: 3, sum: 6},
        {first: 10, second: 4, sum: 14},
        {first: 7, second: 1, sum: 8}
    ];

    for (const {first, second, sum} of cases) {
        it(`returns ${sum} for ${first} and ${second}`, function () {
            expect(add(first, second)).toEqual(sum);
        });
    }
});
```