import "jasmine";
import {quote} from '../src/aModule';
import * as anotherModule from '../src/anotherModule';

describe('aModule', function() {
	describe('quote', function() {
		it('quotes the string returned by theString', function() {
			spyOn(anotherModule, 'theString').and.returnValue('a more different string');
			expect(quote()).toEqual('"a more different string"');
		});
	});
});
