function moveEast(mat: string[][]) {
  const newMat = mat.map((line) => line.slice());
  for (let row = 0; row < mat.length; row++) {
    for (let col = 0; col < mat[0].length; col++) {
      if (
        mat[row][col] === ">" &&
        mat[row][(col + 1) % mat[0].length] === "."
      ) {
        newMat[row][(col + 1) % mat[0].length] = ">";
        newMat[row][col] = ".";
      }
    }
  }
  return newMat;
}

function moveSouth(mat: string[][]) {
  const newMat = mat.map((line) => line.slice());
  for (let col = 0; col < mat[0].length; col++) {
    for (let row = 0; row < mat.length; row++) {
      if (mat[row][col] === "v" && mat[(row + 1) % mat.length][col] === ".") {
        newMat[(row + 1) % mat.length][col] = "v";
        newMat[row][col] = ".";
      }
    }
  }
  return newMat;
}

export function solve1(data: string[]): void {
  let mat = data.map((line) => line.split(""));
  let steps = 0;
  while (true) {
    const newMat1 = moveEast(mat);
    const newMat2 = moveSouth(newMat1);
    steps++;
    if (JSON.stringify(mat) === JSON.stringify(newMat2)) {
      break;
    }
    mat = newMat2;
  }
  console.log(steps);
}

export function solve2(data: string[]): void {
  console.log("No such thing, yay");
}
