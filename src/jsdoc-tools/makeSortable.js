#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {addVersion} = require('./asciibeticalVersion');

if (process.argv.length !== 4) {
    console.log('Usage: makeSortable dirname index-filename');
    process.exit(1);
}

const basedir = process.argv[2];
const indexFilename = process.argv[3];

for (const entry of fs.readdirSync(basedir, {withFileTypes: true})) {
    if (entry.isDirectory() && entry.name !== '.' && entry.name !== '..') {
        const version = entry.name;
        const filename = `${basedir}/${version}/${indexFilename}`;

        fs.writeFileSync(
            filename,
            addVersion(version, fs.readFileSync(filename, {encoding: 'utf8'})),
            {encoding: 'utf8'}
        );
    }
}