---
question: Can Jasmine test code that's in ES modules?
---

Yes. The exact process depends on how you're using Jasmine:

* If you're using the standalone distribution or any other in-browser setup
  where you control the HTML tags, use `<script type="module">`.
* If you're using the jasmine NPM package, your scripts will be loaded using
  [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).
  This means that files will be treated as ES modules if they're in a package
  that has `"type": "module"` in its `package.json` or if their names end in
  `.mjs`.
* jasmine-browser-runner will load scripts as ES modules 
  if their names end in `.mjs`. You can override this with the 
  `esmFilenameExtension` configuration property.
* If you're using a third-party tool such as Karma to run Jasmine, check that
  tool's documentation.
