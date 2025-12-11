// If the probe leaves the cannon with vy = vy0, it will return to y=0 at vy=-vy0-1.
// Then it goes to y=-(vy0+1). So -(vy0+1) >= yMin => vy0 <= -yMin-1
export function solve1(data: string[]): void {
  const match = data[0].match(
    /target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/,
  );
  if (!match) {
    console.log("Invalid input");
    return;
  }
  const yMin = parseInt(match[3], 10);
  const maxVy = -yMin - 1;
  console.log((maxVy * (maxVy + 1)) / 2);
}

// For given vy0,
// y position = (2*vy0-t+1)*t/2
// Want: yMin <= (2*vy0-t+1)*t/2 <= yMax
//  => t^2 - (2*vy0+1)*t + 2*yMin <= 0 and t^2 - (2*vy0+1)*t + 2*yMax >= 0
// Because yMin < yMax < 0, delta > 0 for both (i.e. both parabolas intersect t axis
// twice; the yMax one is above/inside the yMin one).
// Valid t between
// [(2*vy0+1 + sqrt((2*vy0+1)^2 - 8*yMax)]/2 and [(2*vy0+1 + sqrt((2*vy0+1)^2 - 8*yMin)]/2
// (The other range is negative)
function validTRangeForY(
  vy0: number,
  yMin: number,
  yMax: number,
): [number, number] | null {
  const dMax = Math.sqrt((2 * vy0 + 1) ** 2 - 8 * yMax);
  const dMin = Math.sqrt((2 * vy0 + 1) ** 2 - 8 * yMin);
  const tMin = Math.ceil((2 * vy0 + 1 + dMax) / 2);
  const tMax = Math.floor((2 * vy0 + 1 + dMin) / 2);
  if (tMin > tMax) {
    return null;
  }
  return [tMin, tMax];
}

// x position = vx0*(vx0+1)/2 if t >= vx0 else (2*vx0-t+1)*t/2
// Want: xMin <= x position <= xMax
// If vx0*(vx0+1)/2 is in range, then t >= vx0 is valid
// Otherwise,
//  => t^2 - (2*vx0+1)*t + 2*xMin <= 0 and t^2 - (2*vx0+1)*t + 2*xMax >= 0
// Note that the parabola only holds for t < vx0, i.e. left half
// However, this time delta may < 0.
// If deltaMin < 0, then no valid t in this case.
// If deltaMax < 0, then second inequality always true
// => [(2*vx0+1 - sqrt((2*vx0+1)^2 - 8*xMin)]/2 and vx0
// Because xMin > 0, lower bound always positive
// Otherwise, since we only want t < vx0,
// [(2*vx0+1 - sqrt((2*vx0+1)^2 - 8*xMin)]/2 and [(2*vx0+1 - sqrt((2*vx0+1)^2 - 8*xMax)]/2
function validTRangeForX(
  vx0: number,
  xMin: number,
  xMax: number,
): [number, number] | null {
  const dMin = Math.sqrt((2 * vx0 + 1) ** 2 - 8 * xMin);
  if (Number.isNaN(dMin)) return null;
  const tMinFromMin = Math.ceil((2 * vx0 + 1 - dMin) / 2);
  const dMax = Math.sqrt((2 * vx0 + 1) ** 2 - 8 * xMax);
  if (Number.isNaN(dMax)) {
    return [tMinFromMin, Infinity];
  }
  const tMaxFromMax = Math.floor((2 * vx0 + 1 - dMax) / 2);
  return [tMinFromMin, tMaxFromMax];
}

// Already have max(vy0). min(vy0) is yMin (goes there in one step).
// max(vx0) is xMax (goes there in one step).
// min(vx0) is the smallest n with n*(n+1)/2 >= xMin => (n+1/2)^2 - 1/4 >= 2xMin
export function solve2(data: string[]): void {
  const match = data[0].match(
    /target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/,
  );
  if (!match) {
    console.log("Invalid input");
    return;
  }
  const xMin = parseInt(match[1], 10);
  const xMax = parseInt(match[2], 10);
  const yMin = parseInt(match[3], 10);
  const yMax = parseInt(match[4], 10);
  const vxMin = Math.ceil(Math.sqrt(2 * xMin + 0.25) - 0.5);
  const vxMax = xMax;
  const vyMin = yMin;
  const vyMax = -yMin - 1;
  let total = 0;
  for (let vx0 = vxMin; vx0 <= vxMax; vx0++) {
    const xTRange = validTRangeForX(vx0, xMin, xMax);
    for (let vy0 = vyMin; vy0 <= vyMax; vy0++) {
      const yTRange = validTRangeForY(vy0, yMin, yMax);
      if (
        xTRange &&
        yTRange &&
        !(xTRange[1] < yTRange[0] || yTRange[1] < xTRange[0])
      ) {
        total++;
      }
    }
  }
  console.log(total);
}
