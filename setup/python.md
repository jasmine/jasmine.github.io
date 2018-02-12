---
layout: article
title: Python Setup
redirect_from: /edge/python.html
---

# Using Jasmine with Python
The Jasmine Python package contains helper code for developing Jasmine projects for Python-based web projects (Django, Flask, etc.)
or for JavaScript projects where Python is a welcome partner. It serves up a project's Jasmine suite in a browser so you can focus on
your code instead of manually editing script tags in the Jasmine runner HTML file.

## Install
You can install Jasmine using pip or by adding it to your `requirements.txt`.

```sh
pip install jasmine
```

## \_\_init\_\_ a Project
Initailize a project for Jasmine by creating a spec directory and configuration yaml for you.

```sh
jasmine init
```

At this point you should be able to [write your first suite](/tutorials/your_first_suite.html)

## Configuration
Customize `spec/javascripts/support/jasmine.yml` to enumerate the source files, stylesheets, and spec files you would like the
Jasmine runner to include. You may use dir glob strings.

## Usage
Once you have set up your `jasmine.yml`, you can start the Jasmine server by running `jasmine`.

```sh
jasmine server
```

Point your browser to `localhost:8888`. The suite will run every time the page is re-loaded.

Start Jasmine on a different port by passing the `-p` flag.

```sh
jasmine server -p 1337
```

### Continuous Integration
For Continuous Integration environments, run `jasmine ci` in the project build steps:

```sh
jasmine ci
```


The browser used by selenium can be changed by exporting `JASMINE_BROWSER`

```sh
export JASMINE_BROWSER=chrome
jasmine ci
```

or by setting the `----browser` flag.

```sh
jasmine ci --browser firefox
```

You can also specify a randomization seed for an individual jasmine:ci run for debugging purposes.

```sh
jasmine ci --seed 4321
```

