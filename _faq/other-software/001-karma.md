---
question: Can I use Jasmine 5.x with Karma?
---

Probably. karma-jasmine 5.1 (the latest version as of this writing, and likely
the final version) appears to be compatible with jasmine-core 5.x. You should
be able to use an NPM override in `package.json` to override karma-jasmine's 
dependency specification:

```
{
    // ...
    "overrides": {
        "karma-jasmine": {
            "jasmine-core": "^5.0.0"
        }
    }
}
```