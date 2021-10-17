function toAsciibetical(versionNumber) {
    return versionNumber.split('.').map(pad3).join('.');
}

function addVersion(version, input) {
    const lines = input.split('\n');
    const newKey = `sortKey: "${toAsciibetical(version)}"`;

    if (lines[0] !== '---') {
        throw new Error('Did not find YAML at the start of input');
    }

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].startsWith('sortKey: ')) {
            lines[i] = newKey;
            break;
        } else if (lines[i] === '---') {
            lines.splice(i, 0, newKey);
            break;
        }
    }

    return lines.join('\n');
}

function pad3(s) {
    while (s.length < 3) {
        s = '0' + s;
    }

    return s;
}

module.exports = {toAsciibetical, addVersion};
