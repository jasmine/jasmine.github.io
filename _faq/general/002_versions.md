---
question: How does Jasmine get versioned?
slug: versions
---

Jasmine attempts as best as possible to follow [semantic versioning](http://semver.org/). This means we reserve major versions (1.0, 2.0, etc.) for breaking changes or other significant work. Most Jasmine releases end up being minor releases (2.3, 2.4, etc.). These version numbers are dictated by the version of [jasmine-core](https://github.com/jasmine/jasmine) and when the major or minor version is bumped for jasmine-core, we also release new versions of the other primary binding libraries ([jasmine-py](https://github.com/jasmine/jasmine-py), [jasmine-gem](https://github.com/jasmine/jasmine-gem), and [jasmine-npm](https://github.com/jasmine/jasmine-npm)) that bump their dependency to the newest minor version of jasmine-core. This means that when you update your `jasmine` dependency, you'll also get the newest `jasmine-core`. This leaves patch versions up to the particular project, so a patch release (2.4.2, 2.6.3, etc.) of jasmine-core won't require a release of any of the binding libraries, as they could require their own patch releases.
