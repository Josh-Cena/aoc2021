export function solve1(data: string[]): void {
  const lines = data.map(
    (line) =>
      line
        .match(/(\d+),(\d+) -> (\d+),(\d+)/)!
        .slice(1)
        .map(Number) as [number, number, number, number],
  );
  const grid = Array.from({ length: 1000 }, () => Array(1000).fill(0));
  for (const [x1, y1, x2, y2] of lines) {
    if (x1 === x2) {
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        grid[y][x1]++;
      }
    } else if (y1 === y2) {
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        grid[y1][x]++;
      }
    }
  }
  const count = grid.flat().filter((cell) => cell >= 2).length;
  console.log(count);
}

export function solve2(data: string[]): void {
  const lines = data.map(
    (line) =>
      line
        .match(/(\d+),(\d+) -> (\d+),(\d+)/)!
        .slice(1)
        .map(Number) as [number, number, number, number],
  );
  const grid = Array.from({ length: 1000 }, () => Array(1000).fill(0));
  for (const [x1, y1, x2, y2] of lines) {
    if (x1 === x2) {
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        grid[y][x1]++;
      }
    } else if (y1 === y2) {
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        grid[y1][x]++;
      }
    } else {
      const dirX = x2 > x1 ? 1 : -1;
      const dirY = y2 > y1 ? 1 : -1;
      for (let x = x1, y = y1; x !== x2 + dirX; x += dirX, y += dirY) {
        grid[y][x]++;
      }
    }
  }
  const count = grid.flat().filter((cell) => cell >= 2).length;
  console.log(count);
}
