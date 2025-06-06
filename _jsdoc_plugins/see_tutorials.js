const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

let tutorials;

function tutorialExists(text) {
  loadTutorials(text);
  return tutorials.includes(text);
}

function loadTutorials() {
  if (tutorials) {
    return;
  }

  const result = [];
  const exts = /\.(md|html)$/;
  const tutorialPathPattern = /^\/tutorials\//;

  for (const fn of fs.readdirSync('_tutorials/')) {
    if (fn.match(exts)) {
      result.push(fn.replace(exts, ''));

      const fullPath = path.join('_tutorials/', fn);
      const text = fs.readFileSync(fullPath, {encoding: 'utf8'});
      const doc = YAML.parseAllDocuments(text)[0];
      let redirects = doc.contents.get('redirect_from');

      if (redirects) {
        if (typeof redirects === 'string') {
          redirects = [redirects];
        } else if (redirects.items) {
          redirects = redirects.items.map(item => item.value);
        } else {
          throw new Error('Expected redirect_from to be a string or YAMLSeq ' +
              `but it was a ${typeof redirects} ( in ${fn}`)
        }

        for (const r of redirects) {
          if (r.match(tutorialPathPattern)) {
            result.push(r.replace(tutorialPathPattern, ''));
          }
        }
      }
    }
  }

  tutorials = result;
}

exports.handlers = {
  newDoclet: function(e) {
    var doclet = e.doclet;
    if (doclet.see) {
      doclet.see = doclet.see.map(function(see) {
        if (tutorialExists(see)) {
          return '<a href="/tutorials/' + see + '">' + see.replace('_', ' ') + '</a>';
        } else {
          return see;
        }
      });
    }
  }
}
