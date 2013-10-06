require 'fileutils'
require 'tilt'

def build_html(version, files_to_copy = nil, prefix = 'tests', options = {})
  layout_template = Tilt.new('src/layout.erb')
  with_context = OpenStruct.new(options.merge(
    jasmine_version: version
  ))
  layout = "#{prefix}_layout_#{version}.mustache"
  Dir.chdir 'tmp' do
    File.open(layout, 'w+') do |f|
      f << layout_template.render(with_context)
    end
  end

  `bundle exec rocco -l js -t tmp/#{layout} -o tmp/#{prefix} #{Dir.glob(File.join(version, 'src', '*.js')).map(&:inspect).join(' ')}`

  puts "Copying HTML"
  if files_to_copy.nil?
    `mv tmp/#{prefix}/#{version}/src/*.html ./#{version}`
  elsif files_to_copy.size > 0
    files_glob = files_to_copy.size == 1 ? files_to_copy[0] : "{" + files_to_copy.join(',') + "}"
    `mv tmp/no_tests/#{version}/src/#{files_glob}.html ./#{version}`
  end
end

desc "build all 2.0 files"
task :pages do
  FileUtils.rmtree 'tmp' if File.exist? 'tmp'
  FileUtils.mkdir 'tmp'

  layout_template = Tilt.new('src/layout.erb')

  version = '2.0'
  files_without_specs = %w(boot)

  puts "Building files with tests"
  build_html(version)

  puts "Building files without tests"
  build_html(version, files_without_specs, 'no_tests', no_tests: true)
end

