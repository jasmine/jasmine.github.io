var fs = require('fs');

function tutorialExists(text) {
  return fs.existsSync("_versions/edge/" + text + ".html");
}

exports.handlers = {
  newDoclet: function(e) {
    var doclet = e.doclet;
    if (doclet.see) {
      doclet.see = doclet.see.map(function(see) {
        if (tutorialExists(see)) {
          return '<a href="/edge/' + see + '.html">' + see + '</a>';
        } else {
          return see;
        }
      });
    }
  }
}
