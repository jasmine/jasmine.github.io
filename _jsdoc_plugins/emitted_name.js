var fs = require('fs');

/* Adds an emittedName tag to handle situations where there's a mismatch between
   the page we want a doclet to be included in and the syntax a caller would use
   to access the thing being documented. We currently use this to put the
   functions that return asymmetric equality testers on their own page while
   still documenting that they're accessed via the jasmine namespace.

   Example jsdoc usage:
   @name asymmetricEqualityTesters.setContaining
   @emittedName jasmine.setContaining
 */

exports.handlers = {
    newDoclet: function(e) {
        const doclet = e.doclet;

        if (doclet.emittedName) {
            doclet.name = doclet.emittedName;
        }
    }
}

exports.defineTags = function(dictionary) {
    dictionary.defineTag('emittedName', {
        mustHaveValue: true,
        mustNotHaveDescription: true,
        canHaveType: false,
        canHaveName: false,
        onTagged: function(doclet, tag) {
            doclet.emittedName = tag.value;
        }
    });
};
