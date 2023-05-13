require 'rubygems'
require 'bundler/setup'
require 'fileutils'
require 'tilt'
require 'yaml'

file '.current_version' do
  FileUtils.mkdir_p('.current_version')
end

file '.current_browser_runner_version/lib' do
  FileUtils.mkdir_p('.current_browser_runner_version/lib')
end

file '.current_npm_version/reporters' do
  FileUtils.mkdir_p('.current_npm_version/reporters')
end

def download_core_file(file_name)
  `curl -L 'https://raw.github.com/jasmine/jasmine/main/lib/#{file_name}' > .current_version/#{File.basename(file_name)}`
end

desc "update jasmine-core for edge docs"
task :update_edge_jasmine => ['.current_version'] do
  download_core_file('jasmine-core/jasmine.js')
  download_core_file('jasmine-core.js')
  download_core_file('jasmine-core/jasmine-html.js')
  download_core_file('jasmine-core/boot0.js')
  download_core_file('jasmine-core/boot1.js')
end

def download_browser_runner_file(file_name)
  `curl -L 'https://raw.github.com/jasmine/jasmine-browser/main/#{file_name}' > .current_browser_runner_version/#{file_name}`
end

desc "update jasmine-browser-runner for edge docs"
task :update_edge_jasmine_browser => ['.current_browser_runner_version/lib'] do
  download_browser_runner_file('index.js')
  download_browser_runner_file('lib/server.js')
  download_browser_runner_file('lib/runner.js')
  download_browser_runner_file('lib/types.js')
end

def download_npm_file(file_name)
  `curl -L 'https://raw.github.com/jasmine/jasmine-npm/5.0/lib/#{file_name}' > .current_npm_version/#{file_name}`
end

desc "update jasmine-npm for edge docs"
task :update_edge_jasmine_npm => ['.current_npm_version/reporters'] do
  download_npm_file('jasmine.js')
  download_npm_file('parallel_runner.js')
  download_npm_file('runner_base.js')
  download_npm_file('reporters/console_reporter.js')
end

desc "make section of docs for a newly released version of jasmine"
task :release, [:version] do |t, args|
  FileUtils.cp_r('_api/edge', '_api/' + args.version)
end

task :serve do
    system("jekyll serve --baseurl ''")
end
