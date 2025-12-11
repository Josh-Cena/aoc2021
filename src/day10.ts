const checkerScores = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

function checkLine(line: string): number | string[] {
  const stack: string[] = [];
  for (const c of line) {
    if ("([{<".includes(c)) {
      stack.push(c);
    } else {
      const last = stack.pop();
      if (
        (c === ")" && last !== "(") ||
        (c === "]" && last !== "[") ||
        (c === "}" && last !== "{") ||
        (c === ">" && last !== "<")
      ) {
        return checkerScores[c as keyof typeof checkerScores];
      }
    }
  }
  return stack;
}

const completionScores = {
  "(": 1,
  "[": 2,
  "{": 3,
  "<": 4,
};

export function solve1(data: string[]): void {
  let score = 0;
  for (const line of data) {
    const stack: string[] = [];
    const result = checkLine(line);
    if (typeof result === "number") {
      score += result;
    }
  }
  console.log(score);
}

export function solve2(data: string[]): void {
  const scores: number[] = [];
  for (const line of data) {
    const result = checkLine(line);
    if (Array.isArray(result)) {
      let lineScore = 0;
      for (let i = result.length - 1; i >= 0; i--) {
        lineScore =
          lineScore * 5 +
          completionScores[result[i] as keyof typeof completionScores];
      }
      scores.push(lineScore);
    }
  }
  scores.sort((a, b) => a - b);
  console.log(scores[Math.floor(scores.length / 2)]);
}
