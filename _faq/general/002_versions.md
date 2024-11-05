---
question: How is Jasmine versioned?
slug: versions
---

Jasmine attempts as best as possible to
follow [semantic versioning](http://semver.org/). This means we reserve major
versions (1.0, 2.0, etc.) for breaking changes or other significant work. Most
Jasmine releases end up being minor releases (2.3, 2.4, etc.). Major releases
are infrequent.

Many people use Jasmine via either the [`jasmine` package](https://github.com/jasmine/jasmine-npm)
which runs specs in Node or the [`jasmine-browser-runner` package](https://github.com/jasmine/jasmine-browser-runner).
For historical reasons, those packages have different versioning strategies:

* `jasmine` major and minor versions match `jasmine-core`, so that when you update
your `jasmine` dependency you'll also get the latest `jasmine-core`. Patch
versions are handled separately: a patch release of `jasmine-core` does not
require a corresponding patch release of `jasmine`, or vice versa. 
* `jasmine-browser-runner` version numbers are not related to `jasmine-core`
version numbers. It declares `jasmine-core` as a peer dependency. `yarn` and 
`npm` will automatically install a compatible version of `jasmine-core` for you,
or you can specify a version by adding it as a direct dependency of your package.

Jasmine generally avoids dropping support for browser or Node versions except
in major releases. The exceptions to this are Node versions that are past
end of life, browsers that we can no longer install locally and/or test against
in our CI builds, browsers that no longer receive security updates, and browsers
that only run on operating systems that no longer receive security updates.
We'll make reasonable efforts to keep Jasmine working in those environments
but won't necessarily do a major release if they break.
