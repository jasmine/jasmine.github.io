jasmine.github.io [![Build Status](https://travis-ci.org/jasmine/jasmine.github.io.png?branch=master)](https://travis-ci.org/jasmine/jasmine.github.io)
=================

Jasmine doc site

Contributing
=================

1. Fork the repo
1. Create your feature branch (`git checkout -b my-new-docs`)
1. Ensure ruby and bundler (`gem install bundler`) are installed
1. Install ruby dependencies (`bundle`)
1. Make your modifications
 1. Docs for new features go in `edge`
 1. Docs for existing release version go in that directory
 1. Modify the .js, .rb, or .py file in the `src` directory for the version being updated.
 1. Run `rake pages` to rebuild the html pages for edge. If you're editing a different version you can set the `JASMINE_VERSION` environment variable.
1. Commit your changes (git commit -am 'Add some docs')
1. Push to the branch (git push origin my-new-docs)
1. Create new Pull Request
