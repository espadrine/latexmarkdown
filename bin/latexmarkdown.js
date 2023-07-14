#!/usr/bin/env node
import fs from 'fs';
import latexmarkdown from '../index.js';

function main() {
  const options = parseOptions(process.argv.slice(2));
  const input = fs.readFileSync(0, 'utf8');
  const output = options.renderBodyOnly?
    latexmarkdown.renderHTML(input):
    latexmarkdown.renderHTMLDoc(input);
  fs.writeFileSync(1, output);
}

class Options {
  constructor() {
    this.renderBodyOnly = false;
  }
}

function parseOptions(args) {
  const options = new Options();
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
    case '-h':
      printHelp();
      process.exit(0);
    case '--body':
      options.renderBodyOnly = true;
      break;
    }
  }
  return options;
}

function printHelp() {
  console.warn(`Usage: latexmarkdown [-h] [options] <paper.md >paper.html

stdin: is a LaTeXMarkdown file to convert.
stdout: is a generated HTML file.

Options:
  --body: generates only the body (which excludes CSS linking).
          That can be used to serve your own, concatenated CSS.
`);
}

main();
