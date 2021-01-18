# Syntax highlighting

## Blocks

Example for Python:

```python
def factorial(n):
    if n < 2:
        return 1
    else:
        return n * factorial(n-1)
```

Scheme:

```scheme
(define (factorial n)
  (let loop ((cursor n) (product 1))
    (if (<= 1 cursor)
      product
      (loop (-1 cursor) (* product cursor)))))
```

Swift:

```swift
func factorial(_ n: Int) -> Int {
  return (1...max(n, 1)).reduce(1, *)
}
```

Rakudo:

```perl
sub postfix:<!>($n: Int) {
  return [*] 1 .. $n;
}
```

Normal fence:

```
factorial 0 = 1
factorial n = n * (factorial (n - 1))
```

## Inline

Also supported is rust`println!("inline code")`, not to be confused with
the word rust `followed by code`.
