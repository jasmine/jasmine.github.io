/**
 * ## Using Jasmine with node
 * The Jasmine node package contains helper code for developing and running Jasmine tests for node-based projects.
 */

/**
 * ### Install
 * You can install Jasmine using npm, locally in your project and globally to use the CLI tool.
 */

npm install -D jasmine

npm install -g jasmine

/**
 * ### Init a Project
 * Initialize a project for Jasmine by creating a spec directory and configuration json for you.
 */

jasmine init

/**
 * ### Configuration
 * Customize `spec/support/jasmine.json` to enumerate the source files and spec files you would like the
 * Jasmine runner to include. You may use dir glob strings.
 */

/**
 * ### Usage
 * Once you have set up your `jasmine.json`, you can start Jasmine by running `jasmine`.
 */

jasmine
