---
question: I got an npm audit warning about a dependency of one of the Jasmine
          packages. That's a bug in Jasmine, right?
---

Probably not. Most `npm audit` warnings for developer tools are false positives.
They usually fall into at least one, and often both, of these categories:

* Jasmine allows a newer version of the dependency. You're getting a warning
  because your `package-lock.json` is pinning the dependency to an older version.
* Because of the way Jasmine uses the dependency, the bug doesn't result in a
  security vulnerability. For example, bugs in code that processes the command
  line or configuration file are only "exploitable" by someone who already has
  a way to run arbitrary code on your computer.

Many `npm audit` warnings can be resolved by running `npm audit fix`, by running
`npm update <name of package>`, or by deleting `package-lock.json` and running
`npm install`. Please try those approaches before opening an issue. 

Issues that involve `npm audit` warnings are handled on a case-by-case basis. 
Factors include whether the warning could indicate a security problem in the 
context in which Jasmine uses the dependency, the impact of requiring a newer
version, and whether Jasmine requires the version with the warning or merely 
allows it to be installed.