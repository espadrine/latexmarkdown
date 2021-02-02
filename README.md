# LaTeXMarkdown

Write academic publications in Markdown with LaTeX interspersed:

    We can derive that the values $`x \in \mathbb{R}`
    that are in range, follow the equation:

    ```latex
    \phi(x) \geq 1 - \sqrt[N]{1 - \gamma}
    ```

Get it compiled on the command line:

```bash
$ npm install -g latexmarkdown
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

### Automatic links

**Headings** automatically get linkable identifiers with a clickable link:

    # Impact of war on the Lebanese electric grid

…becomes:

    <h1 id="impact-of-war-on-the-lebanese-electric-grid"
      Impact of war on the Lebanese electric grid
      <a href="#impact-of-war-on-the-lebanese-electric-grid">
        §
      </a>
    </h1>

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

- Link to sections / images / tables
- References / Bibliography
- Footnotes? (Maybe as sidenotes?)
- Table of contents
- Tables (can technically already be done in raw HTML)
