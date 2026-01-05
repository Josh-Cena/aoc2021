export function solve1(data: string[]): void {
  const positions = data[0].split(",").map(Number);
  positions.sort((a, b) => a - b);
  const median = positions[Math.floor(positions.length / 2)];
  const fuel = positions.reduce((sum, pos) => sum + Math.abs(pos - median), 0);
  console.log(fuel);
}

export function solve2(data: string[]): void {
  const positions = data[0].split(",").map(Number);
  const mean = Math.round(positions.reduce((a, b) => a + b, 0) / positions.length);
  const fuel = positions.reduce((sum, pos) => {
    const dist = Math.abs(pos - mean);
    return sum + (dist * (dist + 1)) / 2;
  }, 0);
  console.log(fuel);
}
