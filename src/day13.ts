function fold(
  points: [number, number][],
  axis: "x" | "y",
  line: number,
): [number, number][] {
  const newPoints = points.map(([x, y]) => {
    if (axis === "x" && x > line) {
      return [2 * line - x, y];
    } else if (axis === "y" && y > line) {
      return [x, 2 * line - y];
    } else {
      return [x, y];
    }
  });
  const uniquePoints = new Set<string>();
  for (const [x, y] of newPoints) {
    uniquePoints.add(`${x},${y}`);
  }
  return Array.from(uniquePoints).map(
    (s) => s.split(",").map(Number) as [number, number],
  );
}

export function solve1(data: string[]): void {
  const [part1, part2] = data.join("\n").split("\n\n");
  const points = part1.split("\n").map((line) => {
    const [x, y] = line.split(",").map((n) => parseInt(n, 10));
    return [x, y] as [number, number];
  });
  const folds: ["x" | "y", number][] = part2.split("\n").map((line) => {
    const [axis, num] = line.slice(11).split("=");
    return [axis as "x" | "y", parseInt(num, 10)];
  });
  const [axis, line] = folds[0];
  const foldedPoints = fold(points, axis, line);
  console.log(foldedPoints.length);
}

export function solve2(data: string[]): void {
  const [part1, part2] = data.join("\n").split("\n\n");
  const points = part1.split("\n").map((line) => {
    const [x, y] = line.split(",").map((n) => parseInt(n, 10));
    return [x, y] as [number, number];
  });
  const folds: ["x" | "y", number][] = part2.split("\n").map((line) => {
    const [axis, num] = line.slice(11).split("=");
    return [axis as "x" | "y", parseInt(num, 10)];
  });
  let foldedPoints = points;
  for (const [axis, line] of folds) {
    foldedPoints = fold(foldedPoints, axis, line);
  }
  const maxX = Math.max(...foldedPoints.map(([x, _]) => x));
  const maxY = Math.max(...foldedPoints.map(([_, y]) => y));
  const grid: string[][] = Array.from({ length: maxY + 1 }, () =>
    Array.from({ length: maxX + 1 }, () => " "),
  );
  for (const [x, y] of foldedPoints) {
    grid[y][x] = "#";
  }
  for (const row of grid) {
    console.log(row.join(""));
  }
}
