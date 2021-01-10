const assert = require('assert');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

// Execute the CLI with the given args.
// Validates that it matches test/fixtures/cli/args
function exec(args) {
  return new Promise((resolve, reject) => {
    const execf = path.join(__dirname, '..', 'bin', 'latexmarkdown');
    cp.execFile(execf, args, {}, (err, stdout, stderr) => {
      if (err) { return reject(err); }
      const actOut = stdout;
      const actErr = stderr;
      const filename = args.join('-').replace(/[^a-zA-Z0-9-_.]/g, '');
      const outf = path.join(__dirname, 'fixtures', 'cli', filename + '-stdout');
      const errf = path.join(__dirname, 'fixtures', 'cli', filename + '-stderr');
      //fs.writeFileSync(outf, actOut);
      //fs.writeFileSync(errf, actErr);
      const expOut = String(fs.readFileSync(outf));
      const expErr = String(fs.readFileSync(errf));
      if (actOut !== expOut) {
        resolve(new Error(`Wrong stdout: ` +
          `expected\n${expOut}\nactual\n${actOut}`));
      } else if (actErr !== expErr) {
        resolve(new Error(`Wrong stderr: ` +
          `expected\n${expErr}\nactual\n${actErr}`));
      } else { resolve(); }
    });
  });
}

describe('CLI', () => {
  it('supports -h', done => {
    exec(['-h']).then(done).catch(done);
  });
});
