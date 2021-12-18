// Entry point for the latexmarkdown library.
// It is relied upon by the ./bin/latexmarkdown executable.

import { Parser, HtmlRenderer, Node } from 'commonmark';
import katex from 'katex';
import hljs from 'highlight.js';
const hljsLang = hljs.listLanguages();
import { getChildren, cloneNode } from './src/commonmark-helpers.js';

const cmParser = new Parser({
  smart: true,
});
const cmRenderer = new HtmlRenderer();

const inlineCodeModifier = /([a-z0-9_]+|\$)$/;

function latexPass(ast, options = {}) {
  if (options.autolinks == null) { options.autolinks = true; }

  const walker = ast.walker();
  let event, node;
  while ((event = walker.next())) {
    node = event.node;

    if (event.entering) {
      if (node.type === 'code_block') {
        // LaTeX blocks.
        if (node.info === 'latex') {
          const html = katex.renderToString(node.literal, {
            throwOnError: false,
            displayMode: true,
          });
          const newNode = new Node('html_block', node.sourcepos);
          newNode.literal = html;
          node.insertBefore(newNode);
          node.unlink();

        // Syntax highlighting.
        } else if (hljsLang.includes(node.info)) {
          const html = hljs.highlight(node.info, node.literal).value;
          const newNode = new Node('html_block', node.sourcepos);
          newNode.literal = `<pre>${html}</pre>`;
          node.insertBefore(newNode);
          node.unlink();
        }
      }

      // Inline code.
      else if (node.type === 'code' && node.prev && node.prev.literal &&
          inlineCodeModifier.test(node.prev.literal)) {
        const modifier = inlineCodeModifier.exec(node.prev.literal)[0];
        let html;
        // Inline LaTeX.
        if (modifier === '$' || modifier === 'latex') {
          html = katex.renderToString(node.literal, {
            throwOnError: false,
          });
        // Inline code highlighting.
        } else if (hljsLang.includes(modifier)) {
          html = '<code>'
            + hljs.highlight(modifier, node.literal).value
            + '</code>';
        }
        if (html) {
          node.prev.literal =
            node.prev.literal.slice(0, -modifier.length);
          const newNode =
            new Node('html_inline', node.sourcepos);
          newNode.literal = html;
          node.insertBefore(newNode);
          node.unlink();
        }
      }

      // Automatic heading identifiers.
      else if (node.type === 'heading') {
        if (options.autolinks) {
          // Get the textual content of the heading.
          const getLiterals = node => (node.literal? node.literal: '')
            + getChildren(node).map(getLiterals).join(' ');
          const literal = getLiterals(node);

          // Get the HTML render of the heading.
          // We disable autolinks to avoid collision.
          const contentNode = new Node('document', node.sourcepos);
          getChildren(node).map(cloneNode)
            .forEach(c => contentNode.appendChild(c));
          const subOptions = Object.assign({}, options);
          subOptions.autolinks = false;
          const html = renderHTMLFromAST(contentNode, subOptions);

          const level = node.level;
          const htmlID = idFromHeading(literal, level);
          const newNode = new Node('html_block', node.sourcepos);
          newNode.literal = `<h${level} id="${htmlID}">${html} `
            + `<a href="#${htmlID}" `
            +    `class="autolink-clicker" `
            +    `aria-hidden="true">§</a></h${level}>`;
          node.insertBefore(newNode);
          node.unlink();
          walker.current = newNode.next;
        }
      }
    }
  }
  return ast;
}

// Autolinks.

class AutolinkTable {
  constructor() {
    this.headings = [];
    this.ids = new Map(); // Map from id to count.
  }

  // Register a new heading.
  // Return the ID to use for that autolink.
  addHeading(title, level) {
    let id = genIdFromContent(title);
    const autolink = new Autolink(id, level);
    this.headings.push(autolink);

    // Is this ID unique?
    if (this.ids.has(id)) {
      const c = this.ids.get(id) + 1;
      this.ids.set(id, c);
      id += `-${c}`;
    } else {
      this.ids.set(id, 1);
    }

    autolink.id = id;
    return id;
  }
}

class Autolink {
  constructor(id, level) {
    this.id = id;
    this.level = level;
  }
}

const autolinks = new AutolinkTable();

function idFromHeading(title, level) {
  return autolinks.addHeading(title, level);
}

function genIdFromContent(content) {
  // Remove leading numerotation:
  content = content.replace(/^[0-9.-]+[.-]\s*/, '');
  // Remove non-printable characters:
  content = content.replace(/[^\p{L}\p{N}]+/ug, '_');
  return content;
}

// input: a String containing Markdown.
// Returns a String containing HTML.
function renderHTML(input) {
  const ast = cmParser.parse(input);
  return renderHTMLFromAST(ast);
}

function renderHTMLFromAST(ast, options) {
  const latexAST = latexPass(ast, options);
  return cmRenderer.render(latexAST);
}

function renderHTMLDoc(input) {
  const content = renderHTML(input);
  let html = '<!doctype html><meta charset="utf-8"><title></title>\n'
    + '<head>\n'
    + '  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossorigin="anonymous">\n'
    + '  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.5.0/build/styles/default.min.css">\n'
    + '  <style>\n'
    + '    h1 .autolink-clicker,\n'
    + '    h2 .autolink-clicker,\n'
    + '    h3 .autolink-clicker,\n'
    + '    h4 .autolink-clicker,\n'
    + '    h5 .autolink-clicker,\n'
    + '    h6 .autolink-clicker {\n'
    + '      visibility: hidden;\n'
    + '    }\n'
    + '    h1:hover .autolink-clicker,\n'
    + '    h2:hover .autolink-clicker,\n'
    + '    h3:hover .autolink-clicker,\n'
    + '    h4:hover .autolink-clicker,\n'
    + '    h5:hover .autolink-clicker,\n'
    + '    h6:hover .autolink-clicker {\n'
    + '      visibility: visible;\n'
    + '    }\n'
    + '  </style>\n'
    + '</head>\n'
    + '<body>\n'
    + content
    + '</body>\n';
  return html;
}

export default {
  renderHTML: renderHTML,
  renderHTMLDoc: renderHTMLDoc,
};
