exports.handlers = {
  newDoclet: function(e) {
    const doclet = e.doclet;

    if (doclet.overwritable) {
      doclet.description += `\n<p><code>${doclet.name}</code> ` +
          "may be overwritten by user or library code to customize Jasmine's behavior." +
          '</p>';
    }
  }
};

exports.defineTags = function(dictionary) {
  dictionary.defineTag('overwritable', {
    mustNotHaveValue: true,
    mustNotHaveDescription: true,
    canHaveType: false,
    canHaveName: false,
    onTagged: function(doclet, tag) {
      doclet.overwritable = true;
    }
  });
};
