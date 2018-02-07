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

desc "update jasmine library for edge docs"
task :update_edge_jasmine do
  FileUtils.mkdir_p('edge/lib')
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/jasmine.js' > _versions/edge/lib/jasmine.js`
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/jasmine-html.js' > _versions/edge/lib/jasmine-html.js`
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/jasmine.css' > _versions/edge/lib/jasmine.css`
  `curl -L 'https://raw.github.com/pivotal/jasmine/master/lib/jasmine-core/boot.js' > _versions/edge/lib/boot.js`
end

desc "make section of docs for a newly released version of jasmine"
task :release, [:version] do |t, args|
  FileUtils.cp_r('_api/edge', '_api/' + args.version)
end
