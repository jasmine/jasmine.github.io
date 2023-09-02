// Require anotherModule but don't destructure it.
// Destructuring (e.g. const {theString} = require('./anotherModule.js');) will
// prevent code outside this file from replacing toString.
const anotherModule = require('./anotherModule.js');

function quote() {
	return '"' + anotherModule.theString() + '"';
}

module.exports = { quote };
