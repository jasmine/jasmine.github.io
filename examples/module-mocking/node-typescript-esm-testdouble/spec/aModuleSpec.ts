// https://github.com/testdouble/testdouble.js/blob/main/docs/7-replacing-dependencies.md

import * as td from 'testdouble';
import "jasmine";

describe('aModule', function() {
	let subject: any;

	describe('Using TestDouble alone', function() {
		let anotherModule: any;

		beforeEach(async function () {
			anotherModule = await td.replaceEsm('../src/anotherModule.js');
			subject = await import('../src/aModule.js');
		});

		afterEach(function () {
			td.reset();
		});

		describe('quote', function () {
			it('quotes the string returned by theString', function () {
				td.when(anotherModule.theString()).thenReturn('a more different string');
				expect(subject.quote()).toEqual('"a more different string"');
			});
		});
	});

	describe('Using TestDouble to install Jasmine spies', function() {
		let theString: any;

		beforeEach(async function () {
			theString = jasmine.createSpy('anotherModule.theString')
			await td.replaceEsm(
				'../src/anotherModule.js',
				{theString} // named exports
				// If the module has a default export, pass your
				// replacement as the third argument.
			);
			subject = await import('../src/aModule.js');
		});

		afterEach(function () {
			td.reset();
		});

		describe('quote', function () {
			it('quotes the string returned by theString', function () {
				theString.and.returnValue('a more different string');
				expect(subject.quote()).toEqual('"a more different string"');
				expect(theString).toHaveBeenCalled();
			});
		});
	});
});
