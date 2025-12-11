export function solve1(data: string[]): void {
  const positions = data[0].split(",").map(Number);
  const minPos = Math.min(...positions);
  const maxPos = Math.max(...positions);
  let minFuel = Infinity;
  for (let target = minPos; target <= maxPos; target++) {
    let fuel = 0;
    for (const pos of positions) {
      fuel += Math.abs(pos - target);
    }
    if (fuel < minFuel) {
      minFuel = fuel;
    }
  }
  console.log(minFuel);
}

export function solve2(data: string[]): void {
  const positions = data[0].split(",").map(Number);
  const minPos = Math.min(...positions);
  const maxPos = Math.max(...positions);
  let minFuel = Infinity;
  for (let target = minPos; target <= maxPos; target++) {
    let fuel = 0;
    for (const pos of positions) {
      const distance = Math.abs(pos - target);
      fuel += (distance * (distance + 1)) / 2;
    }
    if (fuel < minFuel) {
      minFuel = fuel;
    }
  }
  console.log(minFuel);
}
