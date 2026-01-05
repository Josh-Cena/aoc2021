type Vec3 = [x: number, y: number, z: number];
type Axes = [
  x: number,
  xSign: number,
  y: number,
  ySign: number,
  z: number,
  zSign: number,
];

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

function vecCmp(a: Vec3, b: Vec3): number {
  if (a[0] !== b[0]) return a[0] - b[0];
  if (a[1] !== b[1]) return a[1] - b[1];
  return a[2] - b[2];
}

function vecDedupe(vecs: Vec3[]): Vec3[] {
  vecs.sort(vecCmp);
  const res: Vec3[] = [vecs[0]];
  for (let i = 1; i < vecs.length; i++) {
    if (vecCmp(vecs[i], vecs[i - 1]) !== 0) {
      res.push(vecs[i]);
    }
  }
  return res;
}

function transformAxes(coords: Vec3[], axes: Axes): Vec3[] {
  const [xAxis, xSign, yAxis, ySign, zAxis, zSign] = axes;
  return coords.map(
    (p): Vec3 => [p[xAxis] * xSign, p[yAxis] * ySign, p[zAxis] * zSign],
  );
}

function getDistsMap(beacons: Vec3[], axes: Axes): Map<string, [Vec3, Vec3]> {
  const dists = new Map<string, [Vec3, Vec3]>();
  const transformedScanner = transformAxes(beacons, axes);
  // Must get all pairs because order changes signs of distances
  for (const coords1 of transformedScanner) {
    for (const coords2 of transformedScanner) {
      if (coords1 === coords2) continue;
      const d = vecSub(coords2, coords1);
      if (dists.has(d.join(","))) throw new Error("Duplicate distance");
      dists.set(d.join(","), [coords1, coords2]);
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
  let beaconPositions = scanners[0];
  const scannerPositions: Vec3[] = Array.from(
    { length: scanners.length },
    () => [0, 0, 0],
  );
  findScanner: while (remaining.size > 0) {
    // No need to precompute this
    const alignedDists = getDistsMap(beaconPositions, [0, 1, 1, 1, 2, 1]);
    for (const j of remaining) {
      // 24 orientations to test for scanner j
      for (const axes of getOrientations()) {
        const distsJ = getDistsMap(scanners[j], axes);
        const commonDists = new Map<string, [[Vec3, Vec3], [Vec3, Vec3]]>();
        for (const dist of alignedDists.keys()) {
          if (distsJ.has(dist)) {
            if (commonDists.has(dist))
              throw new Error("Duplicate common distance");
            commonDists.set(dist, [alignedDists.get(dist)!, distsJ.get(dist)!]);
          }
        }
        if (commonDists.size < 132) continue;
        // Rotate scanner j accordingly
        scanners[j] = transformAxes(scanners[j], axes);
        // Find translation
        // At this point, the relative order of beacons are the same.
        // We can sort them first to find the matching ones.
        const commonDistEntries = [...commonDists.values()];
        const overlapAligned = vecDedupe(
          commonDistEntries.flatMap((pairs) => pairs[0]),
        );
        const overlapUnaligned = vecDedupe(
          commonDistEntries.flatMap((pairs) => pairs[1]),
        );
        const translation1 = vecSub(overlapAligned[0], overlapUnaligned[0]);
        const translation2 = vecSub(overlapAligned[1], overlapUnaligned[1]);
        // This is a hack: if the two translations don't match, it means
        // that beaconsJ should actually be flipped in all axes.
        let translation = translation1;
        if (
          translation1[0] !== translation2[0] ||
          translation1[1] !== translation2[1] ||
          translation1[2] !== translation2[2]
        ) {
          translation = vecAdd(
            overlapAligned[0],
            transformAxes(
              [overlapUnaligned[overlapUnaligned.length - 1]],
              [0, -1, 1, -1, 2, -1],
            )[0],
          );
        }
        beaconPositions = vecDedupe([
          ...beaconPositions,
          ...scanners[j].map((coords) => vecAdd(coords, translation)),
        ]);
        remaining.delete(j);
        scannerPositions[j] = translation;
        continue findScanner;
      }
    }
    throw new Error("Cannot make progress");
  }
  return [beaconPositions, scannerPositions];
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
  const [beaconPositions, _] = alignScanners(scanners);
  console.log(beaconPositions.length);
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
