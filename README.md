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

Inline: with ``` `$$x` ``` or ``` `$$x$$` ``` `latex: x` ```
(where `x` is the LaTeX content).

Block: using fenced code.

    ```latex
    x
    ```

## Installation

First, you need to have Node.js installed.

Then, all you need to do is:

    npm install -g latexmarkdown
