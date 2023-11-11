---
question: Why doesn't Jasmine always display a stack trace when a spec fails due to a rejected promise?
---

This is similar to [Why is Jasmine showing an exception with no stack trace?](#no-stack-trace).
If the promise was rejected with an `Error` object as the reason, e.g.
`Promise.reject(new Error("out of cheese"))`, then Jasmine will display the 
stack trace associated with the error. If the promise was rejected with no 
reason or with a non-`Error` reason, then there is no stack trace for Jasmine
to display.