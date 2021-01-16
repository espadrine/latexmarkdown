# $`\LaTeX` Inline

Let us consider $`\phi(x)`, a real-valued PDF.

The question we ask is:
What is the range of values that have a probability latex`\geq\gamma`
(across samplings of $`N` values) of appearing in the sample?

A notational concern is **escaping**: albeit improbable, we might need $​`9.99`
or latex​`_`.

# $`\LaTeX` block

We can derive that the values $`x \in \mathbb{R}`
that are in range, follow the equation:

```latex
\phi(x) \geq 1 - \sqrt[N]{1 - \gamma}
```
