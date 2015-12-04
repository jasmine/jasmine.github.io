require 'rubygems'
require 'bundler/setup'
require 'fileutils'
require 'tilt'
require 'yaml'

def get_version
  ENV['JASMINE_VERSION'] || 'edge'
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

  system("bundle exec rocco -l #{options[:language] || 'js'} -t tmp/#{layout} -o tmp/#{prefix} #{Dir.glob(File.join(version, 'src', '*.{js,rb,py}')).map(&:inspect).join(' ')}")

  puts "Copying HTML"
  if files_to_copy.nil?
    `mv tmp/#{prefix}/#{version}/src/*.html ./#{version}`
  elsif files_to_copy.size > 0
    files_glob = files_to_copy.size == 1 ? files_to_copy[0] : "{" + files_to_copy.join(',') + "}"
    `mv tmp/#{prefix}/#{version}/src/#{files_glob}.html ./#{version}`
  end
end

desc "build all files for $JASMINE_VERSION"
task :pages do
  FileUtils.rmtree 'tmp' if File.exist? 'tmp'
  FileUtils.mkdir 'tmp'

  layout_template = Tilt.new('src/layout.erb')

  version = get_version
  files_without_specs = %w(boot custom_boot node)
  ruby_files = %w(ruby_gem)
  python_files = %w(python_egg)

  puts "Building files with tests"
  build_html(version)

  puts "Building files without tests"
  build_html(version, files: files_without_specs, prefix: 'no_tests', layout_options: { no_tests: true })

  puts "Building ruby files"
  build_html(version, files: ruby_files, prefix: 'ruby', language: 'rb', layout_options: { no_tests: true })

  puts "Building python file"
  build_html(version, files: python_files, prefix: 'python', language: 'py', layout_options: { no_tests: true })

end

desc "build spec runner for $JASMINE_VERSION"
task :spec_runner do
  version = get_version
  template = Tilt.new('src/specRunner.html.erb')
  spec_files = Dir.glob(File.join(version, 'src', '*.js'))
  spec_files.reject! { |filename| filename =~ /boot\.js\z/ }
  context = OpenStruct.new({ version: version, spec_files: spec_files })

  File.open(File.join(version, 'lib', 'specRunner.html'), 'w+') do |f|
    f << template.render(context)
  end

  if spec_files.any? { |filename| filename =~ /focused_specs\.js\z/ }
    spec_files.reject! { |filename| filename =~ /focused_specs\.js\z/ }

    File.open(File.join(version, 'lib', 'specRunner2.html'), 'w+') do |f|
      f << template.render(context)
    end
  end
end

desc "run specs in phantom for $JASMINE_VERSION"
task :phantom => :spec_runner do
  require 'phantomjs'
  version = get_version

  puts "Running specs for documentation of jasmine version #{version}"
  Dir.glob(File.join(version, 'lib', 'specRunner*.html')).each do |runner|
    system "#{Phantomjs.path} src/phantom_runner.js #{File.expand_path(runner)} --no-color"
  end
end

desc "update jasmine library for edge docs"
task :update_edge_jasmine do
  FileUtils.mkdir_p('edge/lib')
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/jasmine.js' > edge/lib/jasmine.js`
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/jasmine-html.js' > edge/lib/jasmine-html.js`
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/jasmine.css' > edge/lib/jasmine.css`
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/boot.js' > edge/lib/boot.js`
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/console/console.js' > edge/lib/console.js`
end

desc "make section of docs for a newly released version of jasmine"
task :release, [:version] do |t, args|
  FileUtils.cp_r('edge', args.version)

  travis_config = YAML.load_file('.travis.yml')
  travis_config['matrix']['include'] << { 'env' => ["JASMINE_VERSION=\"#{args.version}\""] }
  File.open('.travis.yml', 'w') do |f|
    f.write(YAML.dump(travis_config))
  end

  index_html = File.read('index.html')
  index_html.sub!('<!-- NEW VERSIONS HERE -->', %Q{<h2><a href="#{args.version}/introduction.html">#{args.version}</a></h2>\n<!-- NEW VERSIONS HERE -->})
  File.open('index.html', 'w') do |f|
    f.write(index_html)
  end
end
