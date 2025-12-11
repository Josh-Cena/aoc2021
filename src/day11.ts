function neighbors(
  x: number,
  y: number,
  maxX: number,
  maxY: number,
): [number, number][] {
  const result: [number, number][] = [];
  for (const [nx, ny] of [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
  ]) {
    if (nx >= 0 && nx < maxX && ny >= 0 && ny < maxY) {
      result.push([nx, ny]);
    }
  }
  return result;
}

function step(grid: number[][]): number[][] {
  const newGrid: number[][] = grid.map((row) => row.slice());
  const flashers: [number, number][] = [];
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      newGrid[x][y] = (newGrid[x][y] + 1) % 10;
      if (newGrid[x][y] === 0) {
        flashers.push([x, y]);
      }
    }
  }
  while (flashers.length > 0) {
    const [fx, fy] = flashers.pop()!;
    for (const [nx, ny] of neighbors(fx, fy, grid.length, grid[0].length)) {
      if (newGrid[nx][ny] !== 0) {
        newGrid[nx][ny] = (newGrid[nx][ny] + 1) % 10;
        if (newGrid[nx][ny] === 0) {
          flashers.push([nx, ny]);
        }
      }
    }
  }
  return newGrid;
}

export function solve1(data: string[]): void {
  let grid: number[][] = data.map((line) =>
    line.split("").map((c) => parseInt(c)),
  );
  let totalFlashes = 0;
  for (let stepCount = 0; stepCount < 100; stepCount++) {
    grid = step(grid);
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[0].length; y++) {
        if (grid[x][y] === 0) {
          totalFlashes++;
        }
      }
    }
  }
  console.log(totalFlashes);
}

export function solve2(data: string[]): void {
  let grid: number[][] = data.map((line) =>
    line.split("").map((c) => parseInt(c)),
  );
  let stepCount = 0;
  while (true) {
    stepCount++;
    grid = step(grid);
    const allFlashed = grid.every((row) => row.every((value) => value === 0));
    if (allFlashed) {
      console.log(stepCount);
      return;
    }
  }
}
