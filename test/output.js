const assert = require('assert');
const academarkdown = require('..');
const { join } = require('path');
const { promisify } = require('util');
const fs = require('fs');
const [readFile, writeFile] = [fs.readFile, fs.writeFile]
  .map(d => promisify(d));

describe('renderHTML', () => {
  validate('latex');
  validate('highlight');
});

// Convert LaTeXMarkdown from test/fixtures/<test>.md.
// Validates the output against test/fixtures/<test>.html.
function validate(filename) {
  it('should handle ' + filename.replace(/-/g, ' '), async () => {
    const  inf = join(__dirname, 'fixtures', filename + '.md');
    const outf = join(__dirname, 'fixtures', filename + '.html');
    const  expInput = String(await readFile( inf));
    const expOutput = String(await readFile(outf));
    const genOutput = academarkdown.renderHTMLDoc(expInput);
    //writeFile(outf, genOutput);
    assert.equal(genOutput, expOutput);
  });
}
