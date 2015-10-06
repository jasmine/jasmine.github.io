jasmine.github.io [![Build Status](https://travis-ci.org/jasmine/jasmine.github.io.svg?branch=master)](https://travis-ci.org/jasmine/jasmine.github.io)
=================

Jasmine doc site

Contributing
=================

1. Fork the repo
1. Create your feature branch (`git checkout -b my-new-docs`)
1. Ensure ruby and bundler (`gem install bundler`) are installed
1. Install ruby dependencies (`bundle`)
 1. You can install them in the local folder, instead of globally for the system with (`bundle install --path vendor/bundle`)
1. Install pygments (pip install pygments) - would need python and pip (http://pygments.org/)
1. Make your modifications
 1. Docs for new features go in `edge`
 1. Docs for existing release version go in that directory
 1. Modify the .js, .rb, or .py file in the `src` directory for the version being updated.
 1. Run `bundle exec rake pages` to rebuild the html pages for edge. If you're editing a different version you can set the `JASMINE_VERSION` environment variable.
1. Commit your changes (git commit -am 'Add some docs')
1. Push to the branch (git push origin my-new-docs)
1. Create new Pull Request
