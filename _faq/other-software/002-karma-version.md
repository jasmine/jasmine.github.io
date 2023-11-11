---
question: Why aren't newer Jasmine features available in Karma?
---

You might be using an older jasmine-core version than you think you are. 
karma-jasmine declares a dependency on jasmine-core 4.x. As a result, Karma will 
use jasmine-core 4.x even if you've also installed a newer version. You may be 
able to fix that by adding an NPM override as described in the [previous 
question](#001-karma).