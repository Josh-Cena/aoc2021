export function solve(fishes: number[], days: number): void {
  let counterToCount = Array.from({ length: 9 }, () => 0);
  for (const fish of fishes) {
    counterToCount[fish]++;
  }
  for (let day = 1; day <= days; day++) {
    const newCounterToCount = Array.from({ length: 9 }, () => 0);
    for (let newCounter = 0; newCounter < 8; newCounter++) {
      newCounterToCount[newCounter] = counterToCount[newCounter + 1];
    }
    newCounterToCount[6] += counterToCount[0];
    newCounterToCount[8] = counterToCount[0];
    counterToCount = newCounterToCount;
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
