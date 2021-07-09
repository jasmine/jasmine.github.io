---
question: Can Jasmine test code that's in ES modules?
---

Yes. The exact process depends on how you're using Jasmine:

* If you're using the standalone distribution or any other in-browser setup
  where you control the HTML tags, just use `<script type="module">`.
* If you're using the jasmine NPM package, you can load specs and helpers
  as ES modules by giving them names ending in `.mjs` or by adding
  `"jsLoader": "import"` to `jasmine.json`. That setting will
  cause Jasmine to load .js files using
  [dynamc import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports),
  which should be compatible with both ES modules and CommonJS modules.
* jasmine-browser-runner will also load scripts as ES modules 
  if their names end in `.mjs`.
