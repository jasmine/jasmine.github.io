---
layout: article
redirect_from: "/edge/custom_object_formatter.html"
title: Custom Equality
---

<p class="warning">
This page describes a feature that is available in master but has not yet been released as of 3.5.0.
</p>

# Custom Object Formatters

You can customize how Jasmine describes your objects in matcher failure messages by defining your own custom object
formatters. A custom object formatter is simply a function that returns a string if it knows how to describe an object,
or `undefined` if it doesn't.

For instance, consider this test for a Sudoku game in which cells are modeled as objects with `expected`
and `correctValue` properties:

```javascript
it('compares some cells', function() {
    const expectedCells = [
        {correctValue: 4, entry: null},
        {correctValue: 1, entry: {pencil: true, numbers: [1, 2]}},
        {correctValue: 5, entry: {pencil: false, number: 3}}
    ];
    const actualCells = [
        {correctValue: 4, entry: null},
        {correctValue: 1, entry: {pencil: false, number: 2}},
        {correctValue: 5, entry: {pencil: false, number: 4}}
    ];

    expect(actualCells).toEqual(expectedCells);
});
```

That spec will fail with the following message:

```
Expected $[1].entry to have properties
    numbers: [ 1, 2 ]
Expected $[1].entry not to have properties
    number: 2
Expected $[1].entry.pencil = false to equal true.
Expected $[2].entry.number = 4 to equal 3.
```

The output can be improved by defining a custom object formatter that knows how to format cells. If the value is not a
cell, it returns undefined.

```javascript
function formatCell(val) {
    if (val.hasOwnProperty('entry') && val.hasOwnProperty('correctValue')) {
        var entries = val.entry.pencil
            ? 'pencil entries: ' + val.entry.numbers.join(',')
            : 'entry: ' + val.entry.number;

        return '<cell ' + entries + ', correct: ' + val.correctValue + '>';
    }
}
```

Then, register the custom object formatter in a `beforeEach` so Jasmine knows about it.

```javascript
beforeEach(function() {
    jasmine.addCustomObjectFormatter(formatCell);
});
```

Now Jamsine will use the custom object formatter whenever a cell appears in a matcher failure message:

```javascript
Expected $[1] = <cell entry: 2, correct: 1> to equal <cell pencil entries: 1,2, correct: 1>.
Expected $[2] = <cell entry: 4, correct: 5> to equal <cell entry: 3, correct: 5>.
```

Note that in order to use custom object formatters, a <a href="./custom_matcher">custom matcher</a> must either
use <a href="/api/edge/MatchersUtil.html#pp">MatchersUtil#pp</a> to format the expected and actual values for its
failure message or allow Jasmine to generate the message by returning a result object with no `message` property.

```javascript
jasmine.addMatchers({
    // OK: Jasmine will format expected and actual correctly.
    toBeFoo: function (matchersUtil) {
        return {
            compare: function (actual, expected) {
                return {
                    pass: matchersUtil.equals(actual, expected)
                };
            }
        }
    },

    // OK: Uses pp to format expected and actual.
    toBeBar: function (matchersUtil) {
        return {
            compare: function (actual, expected) {
                return {
                    pass: matchersUtil.equals(actual, expected),
                    message: 'Expected ' + matchersUtil.pp(actual) + ' to be bar like ' + 
                        matchersUtil.pp(expected)
                };
            }
        }
    },

    // Won't use custom object formatters.
    toBeBaz: function (matchersUtil) {
        return {
            compare: function (actual, expected) {
                return {
                    pass: matchersUtil.equals(actual, expected),
                    message: 'Expected ' + actual + ' to be baz like ' + expected
                };
            }
        }
    }
});
```