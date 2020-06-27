var fs = require('fs');

function tutorialExists(text) {
  return fs.existsSync("_tutorials/" + text + ".html") || fs.existsSync("_tutorials/" + text + ".md");
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
