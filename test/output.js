const assert = require('assert');
const fs = require('fs');
const path = require('path');
const academarkdown = require('..');

function validate(filename) {
  const  inf = path.join(__dirname, 'fixtures', filename + '.md');
  const outf = path.join(__dirname, 'fixtures', filename + '.html');
  const  expInput = String(fs.readFileSync( inf));
  const expOutput = String(fs.readFileSync(outf));
  it('should handle ' + filename.replace(/-/g, ' '), function() {
    const genOutput = academarkdown.renderHTMLDoc(expInput);
    assert.equal(genOutput, expOutput);
    //fs.writeFileSync(outf, genOutput);
  });
}

describe('renderHTML', function() {
  validate('latex-block');
});
