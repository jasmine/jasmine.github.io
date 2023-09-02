const {theString} = require('./anotherModule.js');

function quote() {
	return '"' + theString() + '"';
}

module.exports = { quote };
