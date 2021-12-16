---
question: How does Jasmine get versioned?
slug: versions
---

Jasmine attempts as best as possible to follow [semantic versioning](http://semver.org/). This means we reserve major versions (1.0, 2.0, etc.) for breaking changes or other significant work. Most Jasmine releases end up being minor releases (2.3, 2.4, etc.). Major releases are very infrequent.

The primary binding libraries
([jasmine-py](https://github.com/jasmine/jasmine-py),
[jasmine-gem](https://github.com/jasmine/jasmine-gem),
and [jasmine-npm](https://github.com/jasmine/jasmine-npm)) have the same major
and minor version as the version of jasmine-core that they depend on. This means
that when you update your `jasmine` dependency, you'll also get the newest
`jasmine-core`. Patch releases (2.4.2, 2.6.3, etc.) are handled separately: a
patch release of `jasmine-core` does not require a corresponding patch release
of `jasmine`, or vice versa.

`jasmine-browser-runner` versions differently because it's newer and not as
mature as `jasmine-core`. Its version numbers are not related to `jasmine-core`
version numbers. It declares `jasmine-core` as a peer dependency. Recent
versions of `yarn` and `npm` will automatically install a compatible version
of `jasmine-core` for you, or you can specify a version by adding it as a
direct dependency of your package.

Jasmine generally avoids dropping support for browser or Node versions except
in major releases. The exceptions to this are Node versions that are past
end of life, browsers that we can no longer install locally and/or test against
in our CI builds, browsers that no longer receive security updates, and browsers
that only run on operating systems that no longer receive security updates.
We'll make reasonable efforts to keep Jasmine working in those environments
but won't necessarily do a major release if they break.
