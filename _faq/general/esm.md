---
question: Can Jasmine test code that's in ES modules?
---

Yes. The exact process depends on how you're using Jasmine:

* If you're using the standalone distribution or any other in-browser setup
  where you control the HTML tags, just use `<script type="module">`.
* If you're using the jasmine NPM package, you can load specs and helpers
  as ES modules by giving them names ending in `.mjs`. If you have ES modules
  with names ending in .js, add "jsLoader": "import" to jasmine.json. This will
  cause Jasmine to load .js files using dynamc import, which should be
  compatible with both ES modules and CommonJS modules.
* jasmine-browser-runner will also load scripts as ES modules 
  if their names end in `.mjs`.
