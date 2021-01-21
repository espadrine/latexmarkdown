# LaTeXMarkdown

Write academic publications in Markdown with LaTeX interspersed:

    We can derive that the values `$$x \in \mathbb{R}`
    that are in range, follow the equation:

    ```latex
    \phi(x) \geq 1 - \sqrt[N]{1 - \gamma}
    ```

Get it compiled on the command line:

```bash
$ <paper.md latexmarkdown >paper.html
```

From there, you may open it in a Web browser, and either print it,
or convert it to PDF, if you are interested in such inferior formats.

## Format

### LaTeX

**Inline**: with `` $`x` `` or `` latex`x` ``
(where `x` is the LaTeX content).

To actually print a visibly concatenated dollar sign with a code `x`,
place a U+200B Zero-Width Space `​` between them.

**Block**: using fenced code.

    ```latex
    x
    ```

### Syntax highlighting

**Block form** is the most common:

    ```rust
    println!("Hello, world!")
    ```

**Inline form**: with `` rust`println!("inline code")` ``.

## Installation

First, you need to have Node.js installed.

Then, all you need to do is:

    npm install -g latexmarkdown

## CLI

- `stdin` is a LaTeXMarkdown file to convert.
- `stdout` is a generated HTML file.
- `--body` generates only the body (which excludes CSS linking).
  That can be used to serve your own, concatenated CSS.

## Plans

- References / Bibliography
- Link to sections / images / tables
- Footnotes? (Maybe as sidenotes?)
- Tables (can technically already be done in raw HTML)
