require 'fileutils'
require 'tilt'

def get_version
  ENV['JASMINE_VERSION'] || '2.0'
end

def build_html(version, options = {})
  layout_template = Tilt.new('src/layout.erb')
  files_to_copy = options[:files]
  prefix = options[:prefix] || 'tests'
  layout_options = options[:layout_options] || {}
  with_context = OpenStruct.new(layout_options.merge(
    jasmine_version: version
  ))
  layout = "#{prefix}_layout_#{version}.mustache"
  Dir.chdir 'tmp' do
    File.open(layout, 'w+') do |f|
      f << layout_template.render(with_context)
    end
  end

  system("bundle exec rocco -l #{options[:language] || 'js'} -t tmp/#{layout} -o tmp/#{prefix} #{Dir.glob(File.join(version, 'src', '*.{js,rb}')).map(&:inspect).join(' ')}")

  puts "Copying HTML"
  if files_to_copy.nil?
    `mv tmp/#{prefix}/#{version}/src/*.html ./#{version}`
  elsif files_to_copy.size > 0
    files_glob = files_to_copy.size == 1 ? files_to_copy[0] : "{" + files_to_copy.join(',') + "}"
    `mv tmp/#{prefix}/#{version}/src/#{files_glob}.html ./#{version}`
  end
end

desc "build all 2.0 files"
task :pages do
  FileUtils.rmtree 'tmp' if File.exist? 'tmp'
  FileUtils.mkdir 'tmp'

  layout_template = Tilt.new('src/layout.erb')

  version = get_version
  files_without_specs = %w(boot)
  ruby_files = %w(ruby_gem)

  puts "Building files with tests"
  build_html(version)

  puts "Building files without tests"
  build_html(version, files: files_without_specs, prefix: 'no_tests', layout_options: { no_tests: true })

  puts "Building ruby files"
  build_html(version, files: ruby_files, prefix: 'ruby', language: 'rb', layout_options: { no_tests: true })
end

desc "build spec runner"
task :spec_runner do
  version = get_version
  template = Tilt.new('src/specRunner.html.erb')
  context = OpenStruct.new({ version: version })

  File.open("#{version}/lib/specRunner.html", 'w+') do |f|
    f << template.render(context)
  end
end

desc "run specs in phantom"
task :phantom => :spec_runner do
  require 'phantomjs'
  version = get_version

  system "#{Phantomjs.path} src/phantom_runner.js #{File.expand_path("#{version}/lib/specRunner.html")} --no-color"
end
