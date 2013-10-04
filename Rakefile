require 'fileutils'
require 'tilt'

desc "build all 2.0 files"
task :pages do
  FileUtils.rmtree 'tmp' if File.exist? 'tmp'
  FileUtils.mkdir 'tmp'

  layout_template = Tilt.new('src/layout.erb')

  version = '2.0'

  Dir.glob("#{version}/src/*.js").each do |jsfile|
    with_context = OpenStruct.new(
      jasmine_version: version,
      jsfile: jsfile
    )
    layout = "layout_#{version}.mustache"
    Dir.chdir 'tmp' do
      File.open("#{layout}", 'w+') do |f|
        f << layout_template.render(with_context)
      end
    end
    puts "Building #{jsfile}..."
    `bundle exec rocco -l js #{jsfile} -t tmp/#{layout} -o tmp`
  end

  puts "Copying HTML for #{version}..."

  `mv tmp/#{version}/src/*.html ./#{version}`
end

