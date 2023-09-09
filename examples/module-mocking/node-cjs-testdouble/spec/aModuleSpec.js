// https://github.com/testdouble/testdouble.js/blob/main/docs/7-replacing-dependencies.md

const td = require('testdouble');

describe('aModule', function() {
	describe('Using TestDouble alone', function() {
		beforeEach(function () {
			this.anotherModule = td.replace('../anotherModule.js');
			this.subject = require('../aModule.js');
		});

		afterEach(function () {
			td.reset();
		});

		describe('quote', function () {
			it('quotes the string returned by theString', function () {
				td.when(this.anotherModule.theString()).thenReturn('a more different string');
				expect(this.subject.quote()).toEqual('"a more different string"');
			});
		});
	});

	describe('Using TestDouble to install Jasmine spies', function() {
		beforeEach(function () {
			this.anotherModule = td.replace(
				'../anotherModule.js',
				{theString: jasmine.createSpy('anotherModule.theString')}
			);
			this.subject = require('../aModule.js');
		});

		afterEach(function () {
			td.reset();
		});

		describe('quote', function () {
			it('quotes the string returned by theString', function () {
				this.anotherModule.theString.and.returnValue('a more different string');
				expect(this.subject.quote()).toEqual('"a more different string"');
				expect(this.anotherModule.theString).toHaveBeenCalled();
			});
		});
	});
});
