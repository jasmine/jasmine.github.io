const anotherModule = require('../anotherModule');
const subject = require('../aModule');

describe('aModule', function() {
	describe('quote', function () {
		it('quotes the string returned by theString', function () {
			// Spies installed with spyOn are automatically cleaned up by
			// Jasmine between tests.
			spyOn(anotherModule, 'theString').and.returnValue('a more different string');
			expect(anotherModule.theString()).toEqual('a more different string');
			expect(subject.quote()).toEqual('"a more different string"');
		});
	});
});
