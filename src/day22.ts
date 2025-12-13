type Cube = { x: [number, number]; y: [number, number]; z: [number, number], sign: 1 | -1 };

function intersectCubes(a: Cube, b: Cube, sign: 1 | -1): Cube | null {
  const x0 = Math.max(a.x[0], b.x[0]), x1 = Math.min(a.x[1], b.x[1]);
  const y0 = Math.max(a.y[0], b.y[0]), y1 = Math.min(a.y[1], b.y[1]);
  const z0 = Math.max(a.z[0], b.z[0]), z1 = Math.min(a.z[1], b.z[1]);
  if (x0 > x1 || y0 > y1 || z0 > z1) return null;
  return { x: [x0, x1], y: [y0, y1], z: [z0, z1], sign };
}

function add(existing: Cube[], cube: Cube): Cube[] {
  const res = [...existing];
  // A U B = A + B - (A intersect B)
  // A \ B = A - (A intersect B)
  // So in either case we need to get the intersection and subtract it
  if (cube.sign === 1) res.push(cube);
  for (const p of existing) {
    const intersection = intersectCubes(p, cube, p.sign === 1 ? -1 : 1);
    if (!intersection) continue;
    res.push(intersection);
  }
  return res;
}

export function solve1(data: string[]): void {
  const cubeOps = data.map((line): Cube => {
    const [prefix, rest] = line.split(" ");
    const [x, y, z] = rest
      .split(",")
      .map((range) => range.split("=")[1].split("..").map(Number) as [number, number]);
    return { x, y, z, sign: prefix === "on" ? 1 : -1 };
  });
  let cubes: Cube[] = [];
  for (const cube of cubeOps) {
    cubes = add(cubes, cube);
  }
  let sum = 0;
  for (const cube of cubes) {
    const [x0, x1] = cube.x;
    const [y0, y1] = cube.y;
    const [z0, z1] = cube.z;
    if (x0 < -50 || x1 > 50 || y0 < -50 || y1 > 50 || z0 < -50 || z1 > 50) continue;
    sum += (x1 - x0 + 1) * (y1 - y0 + 1) * (z1 - z0 + 1) * cube.sign;
  }
  console.log(sum);
}

export function solve2(data: string[]): void {
  const cubeOps = data.map((line): Cube => {
    const [prefix, rest] = line.split(" ");
    const [x, y, z] = rest
      .split(",")
      .map((range) => range.split("=")[1].split("..").map(Number) as [number, number]);
    return { x, y, z, sign: prefix === "on" ? 1 : -1 };
  });
  let cubes: Cube[] = [];
  for (const cube of cubeOps) {
    cubes = add(cubes, cube);
  }
  let sum = 0;
  for (const cube of cubes) {
    const [x0, x1] = cube.x;
    const [y0, y1] = cube.y;
    const [z0, z1] = cube.z;
    sum += (x1 - x0 + 1) * (y1 - y0 + 1) * (z1 - z0 + 1) * cube.sign;
  }
  console.log(sum);
}
