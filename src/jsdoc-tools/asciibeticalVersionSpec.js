const {toAsciibetical, addVersion} = require('./asciibeticalVersion');

describe('asciibeticalVersion', function() {
    describe('toAsciibetical', function() {
        it('pads components so the version numbers sort correctly', function () {
            const input = ['10.2', '10.100', '3.8', '3.9', '3.10'];
            const expected = ['003.008', '003.009', '003.010', '010.002', '010.100'];
            const actual = input.map(toAsciibetical);
            actual.sort();
            expect(actual).toEqual(expected);
        });

        it('returns non-version-numbers unmodified', function() {
            expect(toAsciibetical('edge')).toEqual('edge');
        })
    });

    describe('addVersion', function() {
        it('adds an asciibetical formatted version number', function() {
            const input = '---\n' +
                'layout: default\n' +
                'title: "Global"\n' +
                'prettify: true\n' +
                '---\n' +
                '   some HTML here\n';
            const expected = '---\n' +
                'layout: default\n' +
                'title: "Global"\n' +
                'prettify: true\n' +
                'sortKey: "003.010"\n' +
                '---\n' +
                '   some HTML here\n';
            const output = addVersion('3.10', input);
            expect(output).toEqual(expected);
        });

        it('replaces an existing sortKey', function() {
            const input = '---\n' +
                'layout: default\n' +
                'title: "Global"\n' +
                'prettify: true\n' +
                'sortKey: "003.010"\n' +
                '---\n' +
                '   some HTML here\n';
            const expected = '---\n' +
                'layout: default\n' +
                'title: "Global"\n' +
                'prettify: true\n' +
                'sortKey: "003.011"\n' +
                '---\n' +
                '   some HTML here\n';
            const output = addVersion('3.11', input);
            expect(output).toEqual(expected);
        });

        it('is not fooled by occurrences of sortKey after the YAML', function() {
            const input = '---\n' +
                'layout: default\n' +
                'title: "Global"\n' +
                'prettify: true\n' +
                '---\n' +
                'sortKey: "not the droids you are looking for"';
            const expected = '---\n' +
                'layout: default\n' +
                'title: "Global"\n' +
                'prettify: true\n' +
                'sortKey: "003.011"\n' +
                '---\n' +
                'sortKey: "not the droids you are looking for"';
            const output = addVersion('3.11', input);
            expect(output).toEqual(expected);
        });
    });
});
