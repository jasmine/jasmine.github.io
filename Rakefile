require 'rubygems'
require 'bundler/setup'
require 'fileutils'
require 'tilt'
require 'yaml'

# Create parent dirs for jsdoc sources
[
  '.current_version',
  '.current_browser_runner_version/lib',
  '.current_npm_version',
  '.current_reporters_version'
].each do |path|
  file path do
    FileUtils.mkdir_p(path)
  end
end

def download_core_file(file_name)
  `curl -L 'https://raw.github.com/jasmine/jasmine/main/lib/#{file_name}' > .current_version/#{File.basename(file_name)}`
end

# Usage:
# rake update_edge_jasmine to pull from github
# rake 'update_edge_jasmine[../jasmine]' to pull from local dir ../jasmine
desc "update jasmine-core for edge docs"
task :update_edge_jasmine, [:path] => ['.current_version'] do |t, args|
  if args.path then
    system('cp', "#{args.path}/lib/jasmine-core/jasmine.js", '.current_version/')
    system('cp', "#{args.path}/lib/jasmine-core.js", '.current_version/')
    system('cp', "#{args.path}/lib/jasmine-core/jasmine-html.js", '.current_version/')
    system('cp', "#{args.path}/lib/jasmine-core/boot0.js", '.current_version/')
    system('cp', "#{args.path}/lib/jasmine-core/boot1.js", '.current_version/')
  else
    download_core_file('jasmine-core/jasmine.js')
    download_core_file('jasmine-core.js')
    download_core_file('jasmine-core/jasmine-html.js')
    download_core_file('jasmine-core/boot0.js')
    download_core_file('jasmine-core/boot1.js')
  end
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
  `curl -L 'https://raw.github.com/jasmine/jasmine-npm/main/lib/#{file_name}' > .current_npm_version/#{file_name}`
end

desc "update jasmine-npm for edge docs"
task :update_edge_jasmine_npm => ['.current_npm_version'] do
  download_npm_file('jasmine.js')
  download_npm_file('parallel_runner.js')
  download_npm_file('runner_base.js')
end


desc "update @jasminejs/reporters for edge docs"
task :update_edge_reporters => ['.current_reporters_version'] do
  download_reporters_file('console_reporter.js')
end

def download_reporters_file(file_name)
  `curl -L 'https://raw.github.com/jasmine/reporters/main/lib/#{file_name}' > .current_reporters_version/#{file_name}`
end


desc "make section of docs for a newly released version of jasmine"
task :release, [:version] do |t, args|
  FileUtils.cp_r('_api/edge', '_api/' + args.version)
end

task :serve do
    system("jekyll serve --baseurl ''")
end
