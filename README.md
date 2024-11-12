[Jasmine doc site](https://jasmine.github.io/)

# Contributing

## Prepare your local environment

1. Fork the repo
1. Create your feature branch (`git checkout -b my-new-docs`)
1. Ensure ruby and bundler (`gem install bundler`) are installed
1. Install ruby dependencies (`bundle`)
 1. You can install them in the local folder, instead of globally for the system with (`bundle install --path vendor/bundle`)
1. Install JS dependencies (`npm install`)

## Make your changes

You're ready to make some changes to the documentation!

    .
    ├── _api/                   # Auto-generated API documentation - don't edit by hand!
    ├── _faq/                   # Various FAQ pages
    ├── _includes/              # Jekyll snippets (headers, footers, etc.)
    ├── _layouts/               # Jekyll layouts (overall page structure)
    ├── _tutorials/             # Tutorials / How-to Articles
    │   ├── src/                # Source files for "side-by-side" tutorials
    │   ├── *.md                # Tutorials. See note below about auto-generation.
    ├── css/                    # Stylesheets (SCSS)
    ├── examples/               # Raw javascript examples of jasmine tests (rare)
    ├── pages/                  # Various documentation pages

Note that some files are auto-generated:

* Everything under `_api`, `_npm_api`, and `_browser-runner-runner-api`
* A few of `_tutorials/*.md`. The ones that are auto-generated have a comment
  neaer the top saying what they were generated from.

Don't edit those files directly as any changes you make to them will be lost 
the next time the documentation is generated.

## Test your changes

First, update the jasmine API docs:

- Update local copies of jasmine using `bundle exec rake update_edge_jasmine`
  `bundle exec rake update_edge_jasmine_npm`, and/or
  `bundle exec rake update_edge_jasmine_browser` as appropriate
- Run `npm run jsdoc` to update the API documentation

Then, regenerate the tutorials:

- `node locco.js`

Now preview your changes locally:

- `bundle exec rake serve`

## Adding a new tutorial

Tutorials come in two forms: regular and side-by-side. To create a new regular
tutorial, make a new `.md` file in `_tutorials/`. Add front matter (the YAML
metadata at the top) following the pattern of other files in that directory,
followed by your content in HTML and/or Markdown format.

To create a new side-by-side tutorial, make a new `.js` file in `_tutorials/src`.
Add mixed doc comment blocks and code, following the pattern of other files in
that directory. Then add a configuration for your new tutorial to `locco.js` and
run `node locco.js`. Be sure to check in both the JS source file in
`_tutorials/src` and the generated Markdown file in `_tutorials`.

In either case, you'll need to manually add a link to your new tutorial to 
`pages/docs_home.html`.

## Archiving an old tutorial

To archive an old tutorial:

1. Add `archived: true` to the YAML at the top of the tutorial's Markdown file.
2. Add a link to the tutorial to `pages/archives.html`.

## Publishing API docs for a new version of Jasmine

- Update the edge API docs as described in the previous section
- Copy the edge docs to the new version for each package, e.g.
  `cp -r _api/edge _api/4.4`
- Archive the oldest non-archived version by adding `archived: true` to 
  `_api/<old version>/global.html>`, `_npm-api/Jasmine.html`, and/or 
  `_browser-runner-api/module-jasmine-browser-runner.html`. This will remove the
  version from the listing on the docs home page. It will still be published at
  the same URLs and can still be reached through the Archived Documentation link.

## Submit your changes

- Commit your changes (`git commit -am 'Add some docs'`)
- Push to the branch (`git push origin my-new-docs`)
- Create new Pull Request

# Advanced: providing a live demo

If you're making complicated or potentially controversial changes to the documentation, it
may make sense to provide a live demo that the reviewer can use to compare side-by-side with
the current production site.

## Setup

From the terminal in your local fork of `jasmine.github.io`, create the branch `gh-pages`:

- `git checkout master`
- `git checkout -b gh-pages`
- `git push -u origin HEAD`

Next, enable GitHub Pages for your fork:

- Open your browser and navigate to your fork in GitHub
- Click the `Settings` link
- Under the `GitHub Pages` header, select `Source` -> `gh-pages branch`
- The page will reload. Wait a few minutes, then click the link provided
- You now have a personal live demo under `https://<username>.github.io/jasmine.github.io/`

## Demoing your desired branch

Now that you've configured your live demo link to show the `gh-pages` branch, you can
update what is shown at any time by resetting that branch to your newest changes. For example,
if you've just pushed up the branch `my-complicated-change`, update your live demo
by entering the following in your terminal:

- `git checkout gh-pages`
- `git reset --hard my-complicated-change`
- `git push -f`

Wait a few minutes, and you live demo will now be showing your changes in the `my-complicated-change`
branch. You can then include a link to the demo in your pull request.
