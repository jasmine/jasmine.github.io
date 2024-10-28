---
question: How can I use Jasmine on my TypeScript project?
---

There are two common ways to use Jasmine and TypeScript together. 

The first is to compile TypeScript files to JavaScript on the fly as they're
imported:

* If you're using Vite-specific syntax such as extensionless ES module imports,
  use [tsx](https://www.npmjs.com/package/tsx).
* If you're using standard TypeScript, you can use `@babel/register`. See
  [Testing a React app with Jasmine NPM]({{ site.github.url }}/tutorials/react_with_npm) for an
  example. 

The second approach is to compile your TypeScript spec files to JavaScript files
on disk and configure Jasmine to run the compiled TypeScript files:

* If you're using Vite-specific syntax such as extensionless ES module imports,
  use esbuild.
* If you're using standard TypeScript, use tsc.


The compile-on-the-fly approach is usually easy to set up and provides the
fastest possible edit-compile-run-specs cycle. However, it doesn't do any type
checking by default. You can add type checking by creating a separate TypeScript 
config file for your specs with `noEmit` set to `true`, and running `tsc` on it
either before or after running your specs. Compiling to files on disk gives a
slower edit-compile-run-specs cycle, but it's a more familiar workflow for
people who are used to compiled languages. It's also the only option if you want
to write specs in TypeScript and run them in a browser.
