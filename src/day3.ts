export function solve1(data: string[]): void {
  let gamma = "";
  let epsilon = "";
  const length = data[0].length;
  for (let i = 0; i < length; i++) {
    const counts = [0, 0];
    for (const line of data) {
      counts[parseInt(line[i], 10)]++;
    }
    if (counts[0] > counts[1]) {
      gamma += "0";
      epsilon += "1";
    } else {
      gamma += "1";
      epsilon += "0";
    }
  }
  const gammaNum = parseInt(gamma, 2);
  const epsilonNum = parseInt(epsilon, 2);
  console.log(gammaNum * epsilonNum);
}

export function solve2(data: string[]): void {
  let o2Candidates = [...data];
  let co2Candidates = [...data];
  const length = data[0].length;

  for (let i = 0; i < length; i++) {
    if (o2Candidates.length > 1) {
      const counts = [0, 0];
      for (const line of o2Candidates) {
        counts[parseInt(line[i], 10)]++;
      }
      const mostCommon = counts[0] > counts[1] ? "0" : "1";
      o2Candidates = o2Candidates.filter((line) => line[i] === mostCommon);
    }

    if (co2Candidates.length > 1) {
      const counts = [0, 0];
      for (const line of co2Candidates) {
        counts[parseInt(line[i], 10)]++;
      }
      const leastCommon = counts[0] <= counts[1] ? "0" : "1";
      co2Candidates = co2Candidates.filter((line) => line[i] === leastCommon);
    }
  }

  const o2 = parseInt(o2Candidates[0], 2);
  const co2 = parseInt(co2Candidates[0], 2);
  console.log(o2 * co2);
}
