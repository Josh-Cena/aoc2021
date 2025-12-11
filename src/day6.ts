export function solve(fishes: number[], days: number): void {
  const counterToCount = Array.from({ length: 9 }, () => 0);
  for (const fish of fishes) {
    counterToCount[fish]++;
  }
  for (let day = 1; day <= days; day++) {
    const newCounterToCount = Array.from({ length: 9 }, () => 0);
    for (const [counter, count] of counterToCount.entries()) {
      if (counter === 0) {
        newCounterToCount[6] += count;
        newCounterToCount[8] += count;
      } else {
        newCounterToCount[counter - 1] += count;
      }
    }
    for (let i = 0; i <= 8; i++) {
      counterToCount[i] = newCounterToCount[i];
    }
  }
  const total = counterToCount.reduce((a, b) => a + b, 0);
  console.log(total);
}

export function solve1(data: string[]): void {
  const fishes = data[0].split(",").map(Number);
  solve(fishes, 80);
}

export function solve2(data: string[]): void {
  const fishes = data[0].split(",").map(Number);
  solve(fishes, 256);
}
