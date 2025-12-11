function solve(data: string[], n: number) {
  const start = data[0];
  const rules = Object.fromEntries(
    data.slice(2).map((line) => line.split(" -> ")),
  );
  let pairCounts: Record<string, number> = {};
  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 26; j++) {
      pairCounts[String.fromCharCode(65 + i) + String.fromCharCode(65 + j)] = 0;
    }
  }
  for (let i = 0; i < start.length - 1; i++) {
    const pair = start.slice(i, i + 2);
    pairCounts[pair]++;
  }
  for (let step = 0; step < n; step++) {
    const newPairCounts: Record<string, number> = { ...pairCounts };
    for (const pair in pairCounts) {
      const count = pairCounts[pair];
      if (count > 0 && pair in rules) {
        const insert = rules[pair];
        newPairCounts[pair] -= count;
        newPairCounts[pair[0] + insert] += count;
        newPairCounts[insert + pair[1]] += count;
      }
    }
    pairCounts = newPairCounts;
  }
  const charCounts: Record<string, number> = {};
  for (let i = 0; i < 26; i++) {
    charCounts[String.fromCharCode(65 + i)] = 0;
  }
  for (const pair in pairCounts) {
    const count = pairCounts[pair];
    charCounts[pair[0]] += count;
    charCounts[pair[1]] += count;
  }
  charCounts[start[0]]++;
  charCounts[start[start.length - 1]]++;
  const minCount =
    Math.min(...Object.values(charCounts).filter((x) => x > 0)) / 2;
  const maxCount = Math.max(...Object.values(charCounts)) / 2;
  console.log(maxCount - minCount);
}

export function solve1(data: string[]): void {
  solve(data, 10);
}

export function solve2(data: string[]): void {
  solve(data, 40);
}
