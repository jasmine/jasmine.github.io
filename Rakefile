require 'rubygems'
require 'bundler/setup'
require 'fileutils'
require 'tilt'
require 'yaml'

desc "generate html versions of tutorials"
task :tutorials do
  # manually load up Rocco so we can monkey patch the layout
  require 'rocco'
  class Rocco::Layout
    def title
      filename_without_ext.sub(/\A\d+\w/, '')
    end

    def filename_without_ext
      @no_ext ||= File.basename(@doc.file, '.*')
    end

    def order
      if @order.nil?
        match = filename_without_ext.match(/\A(\d+)_/)
        @order = match ? match[1] : nil
      end
      @order
    end

    def yaml_delimiter
      '---'
    end

    def has_redirects?
      redirects.any?
    end

    def redirects
      base = [ { page: title } ]
      if title == 'your_first_suite'
        base << { page: 'introduction' }
      end
      base
    end
  end

  FileUtils.rm Dir.glob('_tutorials/*.html')
  options = {
    language: 'js',
    template_file: '_layouts/tutorial_docco.html'
  }

  sources = Dir.glob('_tutorials/src/*.js')
  sources.each do |f|
    basename = File.basename(f)
    rocco = Rocco.new(f, sources, options)
    dest = File.join('_tutorials', basename.sub(/\.js$/, '.html').sub(/\A\d+_/, ''))
    puts "Rocco: #{f} -> #{dest}"
    File.open(dest, 'wb') { |fd| fd.write(rocco.to_html) }
  end
end

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
  `curl -L 'https://raw.github.com/jasmine/jasmine/main/lib/jasmine-core/#{file_name}' > .current_version/#{file_name}`
end

desc "update jasmine-core for edge docs"
task :update_edge_jasmine => ['.current_version'] do
  download_core_file('jasmine.js')
  download_core_file('jasmine-html.js')
  download_core_file('boot.js')
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
task :update_edge_jasmine_npm => ['.current_npm_version/reporters'] do
  download_npm_file('jasmine.js')
  download_npm_file('reporters/console_reporter.js')
end

desc "make section of docs for a newly released version of jasmine"
task :release, [:version] do |t, args|
  FileUtils.cp_r('_api/edge', '_api/' + args.version)
end

task :serve do
    `jekyll serve --baseurl ''`
end
