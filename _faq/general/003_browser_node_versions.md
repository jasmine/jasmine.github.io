---
question: What is Jasmine's approach to browser and Node version support?
slug: browser-and-node-versions
---
A list of supported browser and Node versions is included in the release notes 
of each version of Jasmine.

Jasmine supports a rolling window of versions of Node and each supported browser.
As a general rule, versions that still receive security updates, are available
to test against in CI, and are available to us for local testing are fully 
supported. Older versions are supported on a best effort basis for as long as
it's practical to do so.

This approach allows Jasmine to keep supporting older versions of Node and
non-evergreen browsers for longer. However, it does mean that support for
outdated platforms may be dropped in minor versions of Jasmine.

Currently, the support status of platform versions is determined as follows.
This is subject to change. If you need to know what's currently supported, check
the release notes for the Jasmine packages that you're using.

<table>
  <thead>
    <tr>
      <th>Platform</th>
      <th>Fully supported</th>
      <th>Supported on a best effort basis</th>
      <th>Unsupported</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Node</td>
      <td>Current, active, and maintenance LTS releases</td>
      <td>Past-EOL LTS releases that are still known to work and available in CI</td>
      <td>Everything else, including odd-numbered major releases</td>
    </tr>
    <tr>
      <td>Evergreen browsers (Chrome, Firefox mainline, Edge)</td>
      <td>Latest version</td>
      <td></td>
      <td>Everything else*</td>
    </tr>
    <tr>
      <td>Firefox ESR</td>
      <td>Latest major version</td>
      <td>Past-EOL versions that are still known to work and available in CI</td>
      <td>Everything else</td>
    </tr>
    <tr>
      <td>Safari</td>
      <td></td>
      <td>Versions that are known to work and available in CI</td>
      <td>Everything else</td>
    </tr>
    <tr>
      <td>All other platforms</td>
      <td></td>
      <td></td>
      <td>All versions</td>
    </tr>
  </tbody>
</table>

\* In practice, Jasmine is very likely to work with older versions of evergreen
browsers. However, only the latest versions are tested.

"Supported on a best effort basis" means that:
* Jasmine is still tested against that browser or Node version prior to release.
* Reasonable efforts will be made to keep Jasmine working on that browser or
  Node version.
* Bugs that only affect that version might not be fixed unless a user contributes
  a fix.
* Jasmine may drop support for that version in any future release if continued
  support becomes impractical.

"Unsupported" means that:
* Jasmine is not tested against that browser or Node version prior to release.
* Contributed fixes may be accepted, but that doesn't mean that browser or Node 
  version will become supported.
* Except for contributed fixes, no effort will be made to keep Jasmine working
  on that browser or Node version.

[Selenium-webdriver, which is a dependency of jasmine-browser-runner, has a 
more restrictive rolling support window policy](https://www.npmjs.com/package/selenium-webdriver).
So far that hasn't caused any problems, but jasmine-browser-runner users
with a low tolerance for broken builds should be aware of it.