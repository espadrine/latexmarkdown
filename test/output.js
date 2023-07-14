import { strict as assert } from 'node:assert';
import academarkdown from '../index.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import fs from 'fs';
const [readFile, writeFile] = [fs.readFile, fs.writeFile]
  .map(d => promisify(d));
const __dirname = dirname(fileURLToPath(import.meta.url));

describe('renderHTML', () => {
  validate('latex');
  validate('highlight');
  validate('autolink');
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
