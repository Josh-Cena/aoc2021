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
          .map((n) => ({ number: parseInt(n, 10), marked: false })),
      );
      const mapping = new Map<number, [number, number]>();
      for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
          mapping.set(board[r][c].number, [r, c]);
        }
      }
      return { board, mapping };
    });
  const scores: number[] = [];
  const won = new Set<number>();
  for (const n of seq) {
    for (const [i, { board, mapping }] of boards.entries()) {
      if (!mapping.has(n) || won.has(i)) continue;
      const [r, c] = mapping.get(n)!;
      board[r][c].marked = true;
      let isWon = false;
      for (const row of board) {
        if (row.every((cell) => cell.marked)) {
          isWon = true;
          break;
        }
      }
      if (!isWon) {
        for (let c = 0; c < board[0].length; c++) {
          let allMarked = true;
          for (let r = 0; r < board.length; r++) {
            if (!board[r][c].marked) {
              allMarked = false;
              break;
            }
          }
          if (allMarked) {
            isWon = true;
            break;
          }
        }
      }
      if (isWon) {
        const unmarkedSum = board
          .flat()
          .reduce((sum, cell) => (cell.marked ? sum : sum + cell.number), 0);
        scores.push(unmarkedSum * n);
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
