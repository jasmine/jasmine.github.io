---
layout: article
title: Standalone Setup
---

# Using the standalone distribution 

The standalone distribution provides a simple way to run your specs without any
tools other than a web browser. You can download it from the
[releases page](https://github.com/jasmine/jasmine/releases). Included is a 
sample app and sample specs. When you open SpecRunner.html in a web browser,
the sample specs will run. Both the sample spec files and the corresponding
source files are linked in the &lt;head&gt; of SpecRunner.html. You can replace
those files with your own.

You don't need a web server to run the standalone distribution, but it helps. 
Some browsers provide more limited error information to scripts running from 
`file:// URLs`. That can make it harder to debug uncaught exceptions and
unhandled promise rejections. If that's a concern, consider using a simple web
server like the one provided by the [serve](https://www.npmjs.com/package/serve)
package.
