import { strict as assert } from 'node:assert';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import fs from 'fs';
import cp from 'child_process';
const [readFile, writeFile, execFile] =
  [fs.readFile, fs.writeFile, cp.execFile]
  .map(d => promisify(d));
const __dirname = dirname(fileURLToPath(import.meta.url));

describe('CLI', () => {
  validateCLI('supports -h', ['-h']);
  validateCLI('supports simple document', [], 'test');
  validateCLI('supports --body', ['--body'], 'test');
});

// Execute the CLI with the given args.
// Validates that it matches test/fixtures/cli/args
function validateCLI(subject, args, stdin = '') {
  it(subject, async () => {
    const execf = join(__dirname, '..', 'bin', 'latexmarkdown.js');
    const cliPromise = execFile('node', [execf, ...args], {});
    cliPromise.child.stdin.end(stdin);
    const cli = await cliPromise;

    const actOut = cli.stdout;
    const actErr = cli.stderr;
    const filename = subject.replace(/[^a-zA-Z0-9-_.]/g, '');
    const outf = join(__dirname, 'fixtures', 'cli', filename + '-stdout');
    const errf = join(__dirname, 'fixtures', 'cli', filename + '-stderr');
    const expOut = String(await readFile(outf));
    const expErr = String(await readFile(errf));
    //writeFile(outf, actOut);
    //writeFile(errf, actErr);

    assert.equal(expOut, actOut);
    assert.equal(expErr, actErr);
  });
}
