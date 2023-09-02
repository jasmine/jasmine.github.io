---
question: I ran into a problem involving zone.js. Can you help? 
---

Please report any zone.js related issues to the Angular project.

Zone.js monkey patches Jasmine extensively, replacing a number of key internals
with its own implementations. Most of the time this works fine. But any
problems that it causes are by definition bugs in zone.js rather than in Jasmine.