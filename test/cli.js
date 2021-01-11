const assert = require('assert');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

// Execute the CLI with the given args.
// Validates that it matches test/fixtures/cli/args
function validateCLI(subject, args, stdin = '') {
  it(subject, done => {
    new Promise((resolve, reject) => {
      const execf = path.join(__dirname, '..', 'bin', 'latexmarkdown');
      const cli = execFile(execf, args, {}, (err, stdout, stderr) => {
        if (err) { return reject(err); }
        const actOut = stdout;
        const actErr = stderr;
        const filename = subject.replace(/[^a-zA-Z0-9-_.]/g, '');
        const outf = path.join(__dirname, 'fixtures', 'cli', filename + '-stdout');
        const errf = path.join(__dirname, 'fixtures', 'cli', filename + '-stderr');
        const expOut = String(fs.readFileSync(outf));
        const expErr = String(fs.readFileSync(errf));
        //fs.writeFileSync(outf, actOut);
        //fs.writeFileSync(errf, actErr);
        if (actOut !== expOut) {
          resolve(new Error(`Wrong stdout: ` +
            `expected\n${expOut}\nactual\n${actOut}`));
        } else if (actErr !== expErr) {
          resolve(new Error(`Wrong stderr: ` +
            `expected\n${expErr}\nactual\n${actErr}`));
        } else { resolve(); }
      });
      cli.stdin.end(stdin);
    }).then(done).catch(done);
  });
}

describe('CLI', () => {
  validateCLI('supports -h', ['-h']);
  validateCLI('supports simple document', [], 'test');
  validateCLI('supports --body', ['--body'], 'test');
});
