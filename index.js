const commonmark = require('commonmark');
const katex = require('katex');
const hljs = require('highlight.js');
const hljsLang = hljs.listLanguages();

const cmParser = new commonmark.Parser({
  smart: true,
});
const cmRenderer = new commonmark.HtmlRenderer();

const inlineCodeModifier = /([a-z0-9_]+|\$)$/;

function latexPass(ast) {
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
          const newNode = new commonmark.Node('html_block', node.sourcepos);
          newNode.literal = html;
          node.insertBefore(newNode);
          node.unlink();

        // Syntax highlighting.
        } else if (hljsLang.includes(node.info)) {
          const html = hljs.highlight(node.info, node.literal).value;
          const newNode = new commonmark.Node('html_block', node.sourcepos);
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
            new commonmark.Node('html_inline', node.sourcepos);
          newNode.literal = html;
          node.insertBefore(newNode);
          node.unlink();
        }
      }
    }
  }
  return ast;
}

// input: a String containing Markdown.
// Returns a String containing HTML.
module.exports.renderHTML = function(input) {
  const ast = cmParser.parse(input);
  const latexAST = latexPass(ast);
  return cmRenderer.render(latexAST);
};

module.exports.renderHTMLDoc = function(input) {
  const content = module.exports.renderHTML(input);
  let html = '<!doctype html><meta charset="utf-8"><title></title>\n'
    + '<head>\n'
    + '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossorigin="anonymous">\n'
    + '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.5.0/build/styles/default.min.css">\n'
    + '</head>\n'
    + '<body>\n'
    + content
    + '</body>\n';
  return html;
};
