function play(data: string[]): number[] {
  const seq = data[0].split(",").map((n) => parseInt(n, 10));
  const boards = data
    .slice(2)
    .join("\n")
    .split("\n\n")
    .map((s) => {
      const board = s.split("\n").map((line) =>
        line
          .trim()
          .split(/\s+/)
          .map((n) => parseInt(n, 10)),
      );
      const mapping = new Map<number, [number, number]>();
      for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
          mapping.set(board[r][c], [r, c]);
        }
      }
      return {
        mapping,
        rowCount: Array(board.length).fill(0),
        colCount: Array(board[0].length).fill(0),
        boardSum: board.flat().reduce((a, b) => a + b, 0),
      };
    });
  const scores: number[] = [];
  const won = new Set<number>();
  for (const n of seq) {
    for (const [i, data] of boards.entries()) {
      const { mapping, rowCount, colCount } = data;
      if (!mapping.has(n) || won.has(i)) continue;
      const [r, c] = mapping.get(n)!;
      rowCount[r]++;
      colCount[c]++;
      data.boardSum -= n;
      const isWon = rowCount[r] === 5 || colCount[c] === 5;
      if (isWon) {
        scores.push(data.boardSum * n);
        won.add(i);
      }
    }
  }
  return scores;
}

export function solve1(data: string[]): void {
  const scores = play(data);
  console.log(scores[0]);
}

export function solve2(data: string[]): void {
  const scores = play(data);
  console.log(scores[scores.length - 1]);
}
