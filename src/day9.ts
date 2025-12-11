function neighbors(
  board: number[][],
  x: number,
  y: number,
): [number, number][] {
  let result: [number, number][] = [];
  for (const [nx, ny] of [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]) {
    if (nx >= 0 && nx < board.length && ny >= 0 && ny < board[0].length) {
      result.push([nx, ny]);
    }
  }
  return result;
}

export function solve1(data: string[]): void {
  const board: number[][] = data.map((line) =>
    line.split("").map((c) => parseInt(c)),
  );
  let total = 0;
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[0].length; y++) {
      const height = board[x][y];
      if (neighbors(board, x, y).every(([nx, ny]) => board[nx][ny] > height)) {
        total += height + 1;
      }
    }
  }
  console.log(total);
}

export function solve2(data: string[]): void {
  const board: number[][] = data.map((line) =>
    line.split("").map((c) => parseInt(c)),
  );
  const basins: number[] = [];
  const visited: boolean[][] = board.map((row) => row.map(() => false));

  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[0].length; y++) {
      if (
        !neighbors(board, x, y).every(([nx, ny]) => board[nx][ny] > board[x][y])
      ) {
        continue;
      }
      let size = 1;
      const stack: [number, number][] = [[x, y]];
      while (stack.length > 0) {
        const [cx, cy] = stack.pop()!;
        for (const [nx, ny] of neighbors(board, cx, cy)) {
          if (
            !visited[nx][ny] &&
            board[nx][ny] !== 9 &&
            board[nx][ny] >= board[cx][cy]
          ) {
            visited[nx][ny] = true;
            size++;
            stack.push([nx, ny]);
          }
        }
      }
      basins.push(size);
    }
  }
  basins.sort((a, b) => b - a);
  const result = basins.slice(0, 3).reduce((a, b) => a * b, 1);
  console.log(result);
}
