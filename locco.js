/*
    locco: less docco
    Converts JavaScript source files containing documentation blocks into Jekyll
    source. Pretty much the bare minimum subset of docco needed to generate
    Jasmine's side-by-side tutorials.

    Comments with jsdoc style delimiters (opening with slash star star on a
    line by itself, ending with star slash on a line by itself) will be treated
    as documentation. Their contents are assumed to be Markdown. Alternating
    documentation and code blocks are fed to _layouts/tutorail_docco.html as
    a list of {docs, code} pairs.

    Redirects can be specified in this file. They will be omitted
    (i.e. inferred by Jekyll) if not specified.
 */

const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const {marked} = require('marked');

// Per-file configuration.
// Redirects are because the original tutorials were part of the versioned doc
// set, which is now limited to API reference only.
// See commits a3bd33a793de5ff6df4a2f9cdd80162715201f91 and ed3cdb3b70d5aaff6ef5ed5ad97a43e16338c7ca.
const configs = [
    {
        src: '_tutorials/src/your_first_suite.js',
        dest: '_tutorials/your_first_suite.md',
        redirectFrom: [
            {path: '/edge/your_first_suite.html'},
            {path: '/edge/introduction.html'},
        ],
    },
    {
        src: '_tutorials/src/custom_matchers.js',
        dest: '_tutorials/custom_matchers.md',
        redirectFrom: [
            {
                path: '/edge/custom_matcher.html',
                path: '/tutorials/custom_matcher',
            },
        ],
    },
    {
        src: '_tutorials/src/mocking_ajax.js',
        dest: '_tutorials/mocking_ajax.md',
        template: '_layouts/mocking_ajax.yml.mustache',
        redirectFrom: [
            {path: '/edge/mocking_ajax.html'},
        ],
    }
]

for (const config of configs) {
    const src = fs.readFileSync(config.src, {encoding:'utf8'});
    const chunks = chunkify(src);
    processText(chunks);
    const sections = makeSections(chunks);
    const rendered = render(sections, config);
    fs.writeFileSync(config.dest, rendered, {encoding: 'utf8'});
}

function chunkify(src) {
    const lines = src.split('\n');

    // Doc blocks start with /** and end with */. Each of those needs to be on a
    // line by itself, except for optional whitespace.
    const docStartRe = /^\s*\/\*\*\s*$/;
    const docEndRe = /^\s*\*\/\s*$/;
    let inDoc = false;
    let currentChunk = {type: 'code', lines: []}
    const chunks = [currentChunk];

    function currentChunkType() {
        return inDoc ? 'docs' : 'code';
    }

    for (let i = 0; i < lines.length; i++) {
        const delimRe = inDoc ? docEndRe : docStartRe;

        if (lines[i].match(delimRe)) {
            // Switch between docs and code
            inDoc = !inDoc;
            currentChunk = {type: currentChunkType(), lines: []}
            chunks.push(currentChunk)
        } else {
            currentChunk.lines.push(lines[i]);
        }
    }

    if (inDoc) {
        throw new Error('Unclosed doc comment');
    }

    return chunks;
}

function processText(chunks) {
    for (const chunk of chunks) {
        if (chunk.type === 'docs') {
            // Generate an ID from the first line, by removing anything outside
            // a subset of characters we know the template can handle
            chunk.id = chunk.lines[0]
                ?.replace(/[^a-zA-Z0-9\-_:', ]/g, '')
                ?.replace(/^ */, '')
                ?.replace(/ /g, '_');

            // Do markdown processing ourselves. Jekyll's embedded markdown
            // processing is brittle and hard to debug when it goes wrong,
            // which is often.
            chunk.text = marked.parse(unindent(chunk.lines).join('\n'));
        } else {
            chunk.text = chunk.lines.join('\n');
        }

        delete chunk.lines;
    }
}

// Doc comments are often indented, but markdown is sensitive to leading
// whitespace. Find the shortest number of spaces prefixing any line and
// strip that from every line.
function unindent(lines) {
    let minIndent;

    for (line of lines) {
        if (line === '') {
            // Could be an entirely-blank line between indented markdown blocks
            continue;
        }

        const prefix = line.match(/^ */);

        if (minIndent === undefined || prefix[0].length < minIndent) {
            minIndent = prefix[0].length;
        }
    }

    const re = new RegExp(`^ {${minIndent}}`);
    return lines.map(line => line.replace(re, ''));
}

function makeSections(chunks) {
    // Group chunks into sections, each consisting of a docs block and the
    // following code block. If the first chunk is a non-empty code block, it
    // goes in its own section. So does the last chunk if there's an odd number.
    if (chunks[0].text === '') {
        chunks.shift();
    }

    const sections = [];

    if (chunks[0].type === 'code') {
        sections.push({docs: chunks.text});
    }

    while (chunks.length > 0) {
        const docs = chunks.shift();
        const code = chunks.shift();

        if (docs.type !== 'docs') {
            throw new Error('Expected a docs block but got ' + docs.type);
        }

        if (code && code.type !== 'code') {
            throw new Error('Expected a code block but got ' + docs.type);
        }

        sections.push({
            id: docs.id,
            docs: docs.text,
            code: code?.text,
        });
    }

    return sections;
}

function render(sections, config) {
    const tmplPath = config.template || '_layouts/tutorial_docco.yml.mustache';
    const template = fs.readFileSync(tmplPath, {encoding: 'utf8'});
    return mustache.render(template, {
        ...config,
        sections,
        filename: path.basename(config.src).replace(/\.js$/, ''),
        src_path: config.src
    });
}

function findMatchingConfig(srcPath) {
    srcPath = path.resolve(srcPath);

    for (const k of Object.keys(configuredSources)) {
        if (path.resolve(k) === srcPath) {
            return configuredSources[k];
        }
    }

    return {};
}