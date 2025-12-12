# Advent of Code 2021

Language: ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) (4.5.5) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) (16)
Package Manager: ![pnpm](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)

This repo uses my standard AoC setup. Inputs are stored as `inputs/day{n}/{name}.txt`. By default `name` is `real` (the real question). To run a specific day's solution, use the following command:

```bash
pnpm do {day} {part} {name}
```

For example, to run the solution for day 1, part 2 with the example input:

```bash
pnpm do 1 2 ex
```

(And make sure that `inputs/day1/ex.txt` exists.)

Note: this repo is **reconstructed**.

I was young and naïve and didn't actually save each day's work. I used a single file and kept overwriting it. To pay tribute, I'm using the older TypeScript/Node versions I used back then.
