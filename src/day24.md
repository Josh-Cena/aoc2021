# Day 24

This is not a programming question. At least when I try to implement a weakest precondition solver, Node OOMs.

So instead, let's do it by eyes.

The program has 14 chunks, each of the form:

```plain
 1 | inp w
 2 | mul x 0
 3 | add x z
 4 | mod x 26
 5 | div z <n0>
 6 | add x <n1>
 7 | eql x w
 8 | eql x 0
 9 | mul y 0
10 | add y 25
11 | mul y x
12 | add y 1
13 | mul z y
14 | mul y 0
15 | add y w
16 | add y <n2>
17 | mul y x
18 | add z y
```

Among the 14 chunks, only lines 5, 6, 16 may be different in their constant. In particular, `<n0>` can either be 1 or 26; `<n1>` can be between -15 and 15; `<n2>` can be between 1 and 14. Furthermore, `n1 <= n0` iff `n0 == 26`.

If we convert this to TypeScript:

```ts
function chunk(w: number, n0: number, n1: number, n2: number) {
  x = z % 26 + n1 === w ? 0 : 1; // Lines 2, 3, 4, 6, 7, 8
  z = Math.floor(z / n0); // Line 5
  y = 25 * x + 1; // Lines 9, 10, 11, 12
  z *= y; // Line 13
  y = (w + n2) * x; // Lines 14, 15, 16, 17
  z += y; // Line 18
}
```

More compactly:

```ts
function chunk(w: number, n0: number, n1: number, n2: number) {
  if (z % 26 === w - n1) {
    z = Math.floor(z / n0);
  } else {
    z = Math.floor(z / n0) * 26 + w + n2;
  }
}
```

Note that while `n1` can be negative, all other numbers are always positive, including `z`.

This is using `z` as a stack in base-26. If `z.top() == w - n1` and `n0 == 26`, then `z.pop()`. If `z.top() == w - n1` and `n0 == 1`, then do nothing. If `z.top() != w - n1` and `n0 == 1`, then `z.push(w + n2)`. If `z.top() != w - n1` and `n0 == 26`, then `z.replaceTop(w + n2)`.

```ts
function chunk(w: number, n0: number, n1: number, n2: number) {
  if (n0 == 1) {
    z.push(w + n2);
  } else if (z[z.length - 1] == w - n1) {
    z.pop();
  } else {
    z[z.length - 1] = w + n2;
  }
}
```

The goal at the end is to have `z` empty, and we have 7 `n0 == 1` chunks and 7 `n0 == 26` chunks, so we need to pop every time we can. We can pair up each push-chunk and pop-chunk, such that `w_push + n2_push == w_pop - n1_pop`. This creates 7 equations, each of the form `w[i] - w[j] = n` where `i > j`.

Because we want to maximize `w`, we can just greedily maximize each `w[i]`, since these equations are independent of each other.
