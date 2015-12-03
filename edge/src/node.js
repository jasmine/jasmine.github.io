/**
 * ## Using Jasmine with node
 * The Jasmine node package contains helper code for developing and running Jasmine tests for node-based projects.
 */

/**
 * ### Install
 */

/**
 * You can install Jasmine using npm, locally in your project and globally to use the CLI tool.
 */

npm install jasmine

npm install -g jasmine

/**
 * ### Init a Project
 */

/**
 * Initialize a project for Jasmine by creating a spec directory and configuration json for you.
 */

jasmine init

/**
 * ### Generate examples
 */

/**
 * Generate example spec and source files
 */

jasmine examples

/**
 * ### Configuration
 */

/**
 * Customize `spec/support/jasmine.json` to enumerate the source files and spec files you would like the
 * Jasmine runner to include. You may use dir glob strings.
 *
 * `spec_dir` is used as a prefix for all `spec_files` and `helpers`.
 * Helpers are executed before specs.
 */

{
  // Spec directory path. Your spec_files must be relative to this path
  "spec_dir": "spec",
  // Array of filepaths (and globs) relative to spec_dir to include
  "spec_files": [
    "**/*[sS]pec.js"
  ],
  // Array of filepaths (and globs) relative spec_dir to include before jasmine specs
  "helpers": [
    "helpers/**/*.js"
  ],
  // Stop execution of a spec after the first expectation failure in it
  stopSpecOnExpectationFailure: false,
  // Run specs in semi-random order
  random: false
}

/**
 * ### Running tests
 */

/**
 * Once you have set up your `jasmine.json`, you can start Jasmine by running `jasmine` from the root of your project.
 *
 * Pass a relative path to a spec file to the jasmine command to only execute specs in a single file.
 */

jasmine

jasmine spec/appSpec.js

/**
 * #### CLI Options
 */

/**
 * `JASMINE_CONFIG_PATH=`
 * Specify a relative or absolute path to your configuration file. Can be used as an option or set as an environment variable.
 */

JASMINE_CONFIG_PATH=spec/config/jasmine.json jasmine

jasmine JASMINE_CONFIG_PATH=spec/config/jasmine.json

/**
 * `----no-color`
 * Turns off color in spec output
 */
jasmine --no-color

/**
 * `----filter=`
 * Only runs specs that match the given string
 */
jasmine --filter="a spec name"

/**
 * `----stop-on-failure=[true|false]`
 * Stops execution of a spec after the first expectation failure when set to `true`
 */
jasmine --stop-on-failure=true

/**
 * `----random=[true|false]`
 * Tells jasmine to run specs in semi random order or not for this run, overriding `jasmine.json`
 */
jasmine --random=true

/**
 * `----seed=`
 * Sets the randomization seed if randomization is turned on
 */
jasmine --seed=4321

/**
 * ### Using the library
 */

/**
 * Jasmine can also be used as a library in your project.
 */

var Jasmine = require('jasmine');
var jasmine = new Jasmine();

/**
 * #### Load configuration from a file or from an object.
 */

jasmine.loadConfigFile('spec/support/jasmine.json');

jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
        'appSpec.js',
        'requests/**/*[sS]pec.js',
        'utils/**/*[sS]pec.js'
    ],
    helpers: [
        'helpers/**/*.js'
    ]
});

/**
 * #### Custom onComplete
 */

/**
 * Optionally specify a custom `onComplete` callback. The callback is given a boolean of whether all of the specs passed or not. This is often used to message a status to task runners like grunt.
 */

jasmine.onComplete(function(passed) {
    if(passed) {
        console.log('All specs have passed');
    }
    else {
        console.log('At least one spec has failed');
    }
});

/**
 * #### Reporters
 */

/**
 * A ConsoleReporter is included if no other reporters are added. You can configure the default reporter with `configureDefaultReporter`. The default values are shown in the example.
 */

jasmine.configureDefaultReporter({
    timer: new this.jasmine.Timer(),
    print: function() {
        process.stdout.write(util.format.apply(this, arguments));
    },
    showColors: true,
    jasmineCorePath: this.jasmineCorePath
});

/**
 * You can add a custom reporter with `addReporter`. If you add a reporter through `addReporter`, the default ConsoleReporter will not be added.
 * Multiple reporters can be added.
 */

var CustomReporter = require('./myCustomReporter');
var customReporter = new CustomReporter();

jasmine.addReporter(customReporter);

/**
 * #### Run the tests
 */

/**
 * Calling `execute` will run the specs.
 */

jasmine.execute();

/**
 * `execute` can optionally be called with a list of spec file paths to execute relative to your project root and a string to filter by spec name.
 */

jasmine.execute(['fooSpec.js'], 'a spec name');

/**
 * #### A simple example using the library
 */

var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.configureDefaultReporter({
    showColors: false
});
jasmine.execute();
