const commonmark = require('commonmark');
const katex = require('katex');

const cmParser = new commonmark.Parser({
  smart: true,
});
const cmRenderer = new commonmark.HtmlRenderer();

function latexPass(ast) {
  const walker = ast.walker();
  let event, node;
  while ((event = walker.next())) {
    node = event.node;
    if (event.entering && node.type === 'code_block' && node.info === 'latex') {
      const html = katex.renderToString(node.literal, {
        throwOnError: false,
        displayMode: true,
      });
      const newNode = cmParser.parse(html);
      node.insertBefore(newNode);
      node.unlink();
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
    + '</head>\n'
    + '<body>\n'
    + content
    + '</body>\n'
  return html;
};
