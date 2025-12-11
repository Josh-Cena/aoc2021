export function solve1(data: string[]): void {
  let pos = [0, 0];
  for (const line of data) {
    const [dir, valStr] = line.split(" ");
    const val = parseInt(valStr, 10);
    if (dir === "forward") {
      pos[0] += val;
    } else if (dir === "down") {
      pos[1] += val;
    } else if (dir === "up") {
      pos[1] -= val;
    }
  }
  console.log(pos[0] * pos[1]);
}

export function solve2(data: string[]): void {
  let pos = [0, 0];
  let aim = 0;
  for (const line of data) {
    const [dir, valStr] = line.split(" ");
    const val = parseInt(valStr, 10);
    if (dir === "forward") {
      pos[0] += val;
      pos[1] += aim * val;
    } else if (dir === "down") {
      aim += val;
    } else if (dir === "up") {
      aim -= val;
    }
  }
  console.log(pos[0] * pos[1]);
}
