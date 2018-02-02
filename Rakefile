require 'rubygems'
require 'bundler/setup'
require 'fileutils'
require 'tilt'
require 'yaml'

def get_version
  ENV['JASMINE_VERSION'] || 'edge'
end

def version_path
  File.join('_versions', get_version)
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
  Dir.chdir '_tmp' do
    File.open(layout, 'w+') do |f|
      f << layout_template.render(with_context)
    end
  end

  system("bundle exec rocco -l js -t _tmp/#{layout} -o _tmp/#{prefix} #{Dir.glob(File.join('_versions', version, 'src', '*.{js,rb,py}')).map(&:inspect).join(' ')}")

  puts "Copying HTML"
  if files_to_copy.nil?
    `mv _tmp/#{prefix}/_versions/#{version}/src/*.html ./_versions/#{version}`
  elsif files_to_copy.size > 0
    files_glob = files_to_copy.size == 1 ? files_to_copy[0] : "{" + files_to_copy.join(',') + "}"
    `mv _tmp/#{prefix}/_versions/#{version}/src/#{files_glob}.html ./_versions/#{version}`
  end
end

desc "generate html versions of tutorials"
task :tutorials do
  # manually load up Rocco so we can monkey patch the layout
  require 'rocco'
  class Rocco::Layout
    def filename_without_ext
      File.basename(@doc.file, '.*')
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
    dest = File.join('_tutorials', basename.sub(/\.js$/, '.html'))
    puts "Rocco: #{f} -> #{dest}"
    File.open(dest, 'wb') { |fd| fd.write(rocco.to_html) }
  end
end

desc "build all files for $JASMINE_VERSION"
task :pages do
  FileUtils.rmtree '_tmp' if File.exist? '_tmp'
  FileUtils.mkdir '_tmp'

  version = get_version
  files_without_specs = %w(boot)

  puts "Building files with tests"
  build_html(version)

  puts "Building files without tests"
  build_html(version, files: files_without_specs, prefix: 'no_tests', layout_options: { no_tests: true })
end

desc "build spec runner for $JASMINE_VERSION"
task :spec_runner do
  template = Tilt.new('src/specRunner.html.erb')
  spec_files = Dir.glob(File.join(version_path, 'src', '*.js'))
  spec_files.reject! { |filename| filename =~ /boot\.js\z/ }
  context = OpenStruct.new({ version_path: version_path, spec_files: spec_files })

  File.open(File.join(version_path, 'lib', 'specRunner.html'), 'w+') do |f|
    f << template.render(context)
  end

  if spec_files.any? { |filename| filename =~ /focused_specs\.js\z/ }
    spec_files.reject! { |filename| filename =~ /focused_specs\.js\z/ }

    File.open(File.join(version_path, 'lib', 'specRunner2.html'), 'w+') do |f|
      f << template.render(context)
    end
  end
end

desc "run specs in phantom for $JASMINE_VERSION"
task :phantom => :spec_runner do
  require 'phantomjs'
  version = get_version

  phantom_path = ENV['TRAVIS'] ? 'phantomjs' : Phantomjs.path

  puts "Running specs for documentation of jasmine version #{version}"
  Dir.glob(File.join(version_path, 'lib', 'specRunner*.html')).each do |runner|
    system "#{phantom_path} src/phantom_runner.js #{File.expand_path(runner)} --no-color"
  end
end

desc "update jasmine library for edge docs"
task :update_edge_jasmine do
  FileUtils.mkdir_p('edge/lib')
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/jasmine.js' > _versions/edge/lib/jasmine.js`
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/jasmine-html.js' > _versions/edge/lib/jasmine-html.js`
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/jasmine.css' > _versions/edge/lib/jasmine.css`
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/boot.js' > _versions/edge/lib/boot.js`
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/console/console.js' > _versions/edge/lib/console.js`
end

desc "make section of docs for a newly released version of jasmine"
task :release, [:version] do |t, args|
  FileUtils.cp_r('edge', args.version)

  travis_config = YAML.load_file('.travis.yml')
  travis_config['matrix']['include'] << { 'env' => ["JASMINE_VERSION=\"#{args.version}\""] }
  File.open('.travis.yml', 'w') do |f|
    f.write(YAML.dump(travis_config))
  end
end
