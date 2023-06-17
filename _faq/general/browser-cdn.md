---
question: How can I use scripts from external URLs in jasmine-browser-runner?
---

You can add the script's URL to `srcFiles` in your `jasmine-browser.json` or 
`jasmine-browser.js` file:

```javascript
  // ...
  srcFiles: [
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js",
    "**/*.js"
  ],
  // ...
```