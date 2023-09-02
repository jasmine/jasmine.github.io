import {quote} from '../src/aModule.mjs';
import {theString} from 'anotherModule';

describe('aModule', function() {
	describe('quote', function() {
		it('quotes the string returned by theString', function () {
			theString.and.returnValue('a more different string');
			expect(quote()).toEqual('"a more different string"');
		});
	});
});
