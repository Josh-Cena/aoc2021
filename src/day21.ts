function* makeDie() {
  let count = 1;
  try {
    let value = 1;
    while (true) {
      yield value;
      value = (value % 100) + 1;
      count++;
    }
  } finally {
    return count;
  }
}

class Player {
  position: number;
  score: number;

  constructor(startPosition: number) {
    this.position = startPosition;
    this.score = 0;
  }

  move(steps: number) {
    this.position = ((this.position + steps - 1) % 10) + 1;
    this.score += this.position;
  }

  playTurn(die: Generator<number, number, unknown>) {
    let move = 0;
    for (let i = 0; i < 3; i++) {
      move += die.next().value;
    }
    this.move(move);
  }
}

export function solve1(data: string[]): void {
  const player1 = new Player(
    Number(data[0].slice("Player 1 starting position: ".length).trim()),
  );
  const player2 = new Player(
    Number(data[1].slice("Player 2 starting position: ".length).trim()),
  );
  const die = makeDie();

  while (player1.score < 1000 && player2.score < 1000) {
    player1.playTurn(die);
    if (player1.score >= 1000) {
      break;
    }
    player2.playTurn(die);
  }

  const losingScore = Math.min(player1.score, player2.score);
  const totalRolls = die.return(-1).value;
  console.log(losingScore * totalRolls);
}

export function solve2(data: string[]): void {
  const player1 = Number(
    data[0].slice("Player 1 starting position: ".length).trim(),
  );
  const player2 = Number(
    data[1].slice("Player 2 starting position: ".length).trim(),
  );

  // For one player, rolling the die three times creates 27 worlds:
  const rolls = [
    [3, 1],
    [4, 3],
    [5, 6],
    [6, 7],
    [7, 6],
    [8, 3],
    [9, 1],
  ];
  // We just use these to propagate the states.
  // A state contains: player1/2 position/score/turn number, so 10x10x21x21x42
  // which is about 2M states -- reasonable.
  // Note, at the very least, every player's score increases by 1, so the game
  // always ends after at most 42 turns.
  const states = Array.from({ length: 11 }, () =>
    Array.from({ length: 11 }, () =>
      Array.from({ length: 22 }, () =>
        Array.from({ length: 22 }, () => Array.from({ length: 43 }, () => 0)),
      ),
    ),
  );
  // After the 0th turn, both are at starting position with no score
  states[player1][player2][0][0][0] = 1;
  for (let turn = 0; turn < 42; turn++) {
    for (let p1Pos = 1; p1Pos <= 10; p1Pos++) {
      for (let p1Score = 0; p1Score < 21; p1Score++) {
        for (let p2Pos = 1; p2Pos <= 10; p2Pos++) {
          for (let p2Score = 0; p2Score < 21; p2Score++) {
            const count = states[p1Pos][p2Pos][p1Score][p2Score][turn];
            const newTurn = turn + 1;
            if (count > 0) {
              for (const [roll, freq] of rolls) {
                if (turn % 2 === 0) {
                  const newP1Pos = ((p1Pos + roll - 1) % 10) + 1;
                  const newP1Score = Math.min(p1Score + newP1Pos, 21);
                  states[newP1Pos][p2Pos][newP1Score][p2Score][newTurn] +=
                    count * freq;
                } else {
                  const newP2Pos = ((p2Pos + roll - 1) % 10) + 1;
                  const newP2Score = Math.min(p2Score + newP2Pos, 21);
                  states[p1Pos][newP2Pos][p1Score][newP2Score][newTurn] +=
                    count * freq;
                }
              }
            }
          }
        }
      }
    }
  }

  let player1Wins = 0;
  let player2Wins = 0;
  for (let loserScore = 1; loserScore < 21; loserScore++) {
    for (let p1Pos = 1; p1Pos <= 10; p1Pos++) {
      for (let p2Pos = 1; p2Pos <= 10; p2Pos++) {
        for (let turn = 0; turn < 42; turn++) {
          if (turn % 2 === 0) {
            player2Wins += states[p1Pos][p2Pos][loserScore][21][turn];
          } else {
            player1Wins += states[p1Pos][p2Pos][21][loserScore][turn];
          }
        }
      }
    }
  }

  console.log(Math.max(player1Wins, player2Wins));
}
