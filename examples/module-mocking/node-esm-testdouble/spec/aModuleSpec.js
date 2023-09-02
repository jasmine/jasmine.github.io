// https://github.com/testdouble/testdouble.js/blob/main/docs/7-replacing-dependencies.md

import * as td from 'testdouble';

describe('aModule', function() {
	describe('Using TestDouble alone', function() {
		beforeEach(async function () {
			this.anotherModule = await td.replaceEsm('../anotherModule.js');
			this.subject = await import('../aModule.js');
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
		beforeEach(async function () {
			this.theString = jasmine.createSpy('anotherModule.theString')
			await td.replaceEsm(
				'../anotherModule.js',
				{theString: this.theString} // named exports
				// If the module has a default export, pass your
				// replacement as the third argument.
			);
			this.subject = await import('../aModule.js');
		});

		afterEach(function () {
			td.reset();
		});

		describe('quote', function () {
			it('quotes the string returned by theString', function () {
				this.theString.and.returnValue('a more different string');
				expect(this.subject.quote()).toEqual('"a more different string"');
				expect(this.theString).toHaveBeenCalled();
			});
		});
	});
});
