## Using jasmine with ruby
# The jasmine gem can be use both with and without Rails.

# Add the jasmine gem to your gemfile and `bundle install`
gem 'jasmine'

### Setup
# To install a default jasmine.yml and a sample jasmine_helper.rb

# If your project is using Rails, jasmine has generators you can use to get everything set up.
rails g jasmine:install
# If your project doesn't use Rails, all of these commands also exist in the command line tool `jasmine`.
# The command line tool will also modify your Rakefile to load the jasmine tasks
jasmine init

# Jasmine also has some example specs, with implementation, that you can install.
rails g jasmine:examples
jasmine examples

### Use
# Once you've installed your `jasmine.yml` two commands will be available to you in `rake`.

# If you want to start a server that continues to run so you can point a browser at it
rake jasmine
# For use on your CI server
rake jasmine:ci

### Configuration
# Primary configuration is done in `jasmine.yml`, which is in `spec/javascripts/support` by default.
# `jasmine.yml` has configuration on what files should be loaded on the page running tests as well as the location of a ruby file to be loaded for more complex configuration, demonstrated below:

# The `jasmine_helper.rb` file specified by the `spec_helper` key in `jasmine.yml` consists of a configure block.
Jasmine.configure do |config|
  # You can add rack handlers for specific urls
  config.add_rack_path '/something' do
    [200]
  end
  # And mount other rack applications
  config.add_rack_app MyRackApp
  # You can configure the port that the `rake jasmine` command starts a server on
  config.server_port = 12345
  # You can configure the port that the `rake jasmine:ci` command starts it's server on
  config.ci_port = 54321
  # You can add [custom formatters](#section-Custom_Formatters)
  config.formatters << My::Custom::Formatter
  # You can use a [custom runner](#section-Custom_Runners)
  # The `runner` option on config should be a lambda or Proc that receives a formatter and server url and returns a constructed runner object.
  # The lambda allows you to configure other options that need to be configured at initialization time.
  config.runner = lambda { |formatter, server_url| My::Custom::Runner.new(formatter, server_url, 100) }
end

### Custom Formatters

# Your custom formatter must implement 2 methods, `format` and `done`
class My::Custom::Formatter
  # `format` is called by the runner every time it gets a batch of results from the page.
  # The parameter will be an array of `Jasmine::Result` objects
  def format(results)
    results.each do |result|
      puts result.status
    end
  end

  # `done` will be called by the runner after all results have come in.
  def done
    puts 'Done running tests'
  end
end

### Custom Runners

# Once constructed, a runner only needs to implement a `run` method
class My::Custom::Runner
  def initialize(formatter, jasmine_server_url, result_batch_size)
    # The formatter passed in is responsible for making sure all configured formatters receive the same messages.
    @formatter = formatter
    # The `jasmine_server_url` is the full http://&lt;host&gt;:&lt;port&gt; url where the jasmine server was started
    @jasmine_server_url = jasmine_server_url
    @result_batch_size = result_batch_size
  end

  # `run` is responsible coordinating the test run.
  def run
    # Here we're using Phantom to load the page and run the specs
    command = "#{Phantomjs.path} 'phantom_jasmine_run.js' #{@jasmine_server_url} #{@result_batch_size}"
    IO.popen(command) do |output|
      # The `phantom_jasmine_run.js` script writes out batches of results as JSON
      output.each do |line|
        raw_results = JSON.parse(line, :max_nesting => false)
        # Formatters expect to get `Jasmine::Result` objects.
        # It is the runner's job to convert the result objects from the page, and pass them to the `format` method of their formatter.
        results = raw_results.map { |r| Result.new(r) }
        @formatter.format(results)
      end
    end
    # When the tests have finished, call `done` on the formatter to run any necessary completion logic.
    @formatter.done
  end

  # If the runner needs some javascript to be loaded into the page as part of the load, it returns the full path in `boot_js`
  def boot_js
    File.expand_path('runner_boot.js', __FILE__)
  end
end
