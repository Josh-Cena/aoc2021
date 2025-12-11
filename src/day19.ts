type Vec3 = [number, number, number];
type Axes = [number, number, number, number, number, number];

function* getOrientations(): Generator<Axes> {
  for (const xAxis of [0, 1, 2]) {
    for (const xSign of [1, -1]) {
      for (const yAxis of [0, 1, 2]) {
        if (yAxis === xAxis) continue;
        for (const ySign of [1, -1]) {
          const zAxis = 3 - xAxis - yAxis;
          const zSign = xSign * ySign;
          yield [xAxis, xSign, yAxis, ySign, zAxis, zSign];
        }
      }
    }
  }
}

function vecAdd(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function vecSub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function vecSort(a: Vec3, b: Vec3): number {
  if (a[0] !== b[0]) return a[0] - b[0];
  if (a[1] !== b[1]) return a[1] - b[1];
  return a[2] - b[2];
}

function vecDedupe(vecs: Vec3[]): Vec3[] {
  return [...new Set(vecs.map((coords) => coords.join(",")))].map(
    (str) => str.split(",").map(Number) as Vec3,
  );
}

function transformAxes(coords: Vec3[], axes: Axes): Vec3[] {
  const [xAxis, xSign, yAxis, ySign, zAxis, zSign] = axes;
  return coords.map(
    (p): Vec3 => [p[xAxis] * xSign, p[yAxis] * ySign, p[zAxis] * zSign],
  );
}

function getDistsMap(scanner: Vec3[], axes: Axes): Map<string, [Vec3, Vec3][]> {
  const dists = new Map<string, [Vec3, Vec3][]>();
  const transformedScanner = transformAxes(scanner, axes);
  // Must get all pairs because order changes signs of distances
  for (const coords1 of transformedScanner) {
    for (const coords2 of transformedScanner) {
      if (coords1 === coords2) continue;
      const d = vecSub(coords2, coords1);
      const points = dists.get(d.join(",")) ?? [];
      points.push([coords1, coords2]);
      dists.set(d.join(","), points);
    }
  }
  return dists;
}

function alignScanners(scanners: Vec3[][]): [Vec3[], Vec3[]] {
  // 26 scanners, each ~26 beacons
  const remaining = new Set<number>(
    Array.from({ length: scanners.length }, (_, i) => i),
  );
  remaining.delete(0);
  let alignedBeacons = scanners[0];
  const scannerPositions: Vec3[] = Array.from(
    { length: scanners.length },
    () => [0, 0, 0],
  );
  while (remaining.size > 0) {
    // No need to precompute this
    const distsI = getDistsMap(alignedBeacons, [0, 1, 1, 1, 2, 1]);
    for (const j of remaining) {
      // 24 orientations to test for scanner j
      testOrientations: for (const axes of getOrientations()) {
        const distsJ = getDistsMap(scanners[j], axes);
        const commonDists = new Map<string, [[Vec3, Vec3][], [Vec3, Vec3][]]>();
        for (const dist of distsI.keys()) {
          if (distsJ.has(dist)) {
            commonDists.set(dist, [distsI.get(dist)!, distsJ.get(dist)!]);
          }
        }
        for (const pairs of commonDists.values()) {
          if (pairs[0].length !== pairs[1].length) {
            continue testOrientations;
          }
        }
        const numPairs = [...commonDists.values()].reduce(
          (acc, val) => acc + val[0].length,
          0,
        );
        if (numPairs >= 132) {
          // Rotate scanner j accordingly
          scanners[j] = transformAxes(scanners[j], axes);
          // Find translation
          // At this point, the relative order of beacons are the same.
          // We can sort them first to find the matching ones.
          const beaconsI = vecDedupe(
            [...commonDists.values()].map((pairs) => pairs[0].flat()).flat(),
          ).sort(vecSort);
          const beaconsJ = vecDedupe(
            [...commonDists.values()].map((pairs) => pairs[1].flat()).flat(),
          ).sort(vecSort);
          const translation1 = vecSub(beaconsI[0], beaconsJ[0]);
          const translation2 = vecSub(beaconsI[1], beaconsJ[1]);
          // This is a hack: if the two translations don't match, it means
          // that beaconsJ should actually be flipped in all axes.
          let translation = translation1;
          if (
            translation1[0] !== translation2[0] ||
            translation1[1] !== translation2[1] ||
            translation1[2] !== translation2[2]
          ) {
            scanners[j] = transformAxes(scanners[j], [0, -1, 1, -1, 2, -1]);
            translation = vecAdd(beaconsI[0], beaconsJ[beaconsJ.length - 1]);
          }
          alignedBeacons = vecDedupe([
            ...alignedBeacons,
            ...scanners[j].map((coords) => vecAdd(coords, translation)),
          ]).sort(vecSort);
          remaining.delete(j);
          scannerPositions[j] = translation;
          console.log(`Aligned scanner ${j}, translation: ${translation}`);
          break testOrientations;
        }
      }
    }
  }
  if (remaining.size > 0) {
    throw new Error("Some scanners could not be aligned");
  }
  return [alignedBeacons, scannerPositions];
}

export function solve1(data: string[]): void {
  const scanners = data
    .join("\n")
    .split("\n\n")
    .map((block) =>
      block
        .split("\n")
        .slice(1)
        .map((line) => line.split(",").map(Number) as Vec3),
    );
  const [alignedBeacons, _] = alignScanners(scanners);
  console.log(alignedBeacons.length);
}

export function solve2(data: string[]): void {
  const scanners = data
    .join("\n")
    .split("\n\n")
    .map((block) =>
      block
        .split("\n")
        .slice(1)
        .map((line) => line.split(",").map(Number) as Vec3),
    );
  const [_, scannerPositions] = alignScanners(scanners);
  const distances: number[] = [];
  for (let i = 0; i < scannerPositions.length; i++) {
    for (let j = i + 1; j < scannerPositions.length; j++) {
      const d =
        Math.abs(scannerPositions[i][0] - scannerPositions[j][0]) +
        Math.abs(scannerPositions[i][1] - scannerPositions[j][1]) +
        Math.abs(scannerPositions[i][2] - scannerPositions[j][2]);
      distances.push(d);
    }
  }
  console.log(Math.max(...distances));
}
