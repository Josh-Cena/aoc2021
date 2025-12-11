const digits = {
  abcefg: "0",
  cf: "1",
  acdeg: "2",
  acdfg: "3",
  bcdf: "4",
  abdfg: "5",
  abdefg: "6",
  acf: "7",
  abcdefg: "8",
  abcdfg: "9",
};

// a: 8 times
// b: 6 times
// c: 8 times
// d: 7 times
// e: 4 times
// f: 9 times
// g: 7 times

export function solve1(data: string[]): void {
  const count = data
    .map((line) => line.split(" | ")[1])
    .flatMap((output) => output.split(" "))
    .filter((digit) => [2, 3, 4, 7].includes(digit.length));

  console.log(count.length);
}

export function solve2(data: string[]): void {
  let total = 0;
  for (const line of data) {
    const [patterns, output] = line
      .split(" | ")
      .map((part) => part.trim().split(" "));
    const segmentCount: Record<string, number> = Object.fromEntries(
      "abcdefg".split("").map((segment) => [segment, 0]),
    );
    for (const pattern of patterns) {
      for (const segment of pattern) {
        segmentCount[segment]++;
      }
    }
    const segmentToRealSegment: Record<string, string> = {};
    const count8 = [];
    const count7 = [];
    for (const [segment, count] of Object.entries(segmentCount)) {
      if (count === 4) {
        segmentToRealSegment[segment] = "e";
      } else if (count === 6) {
        segmentToRealSegment[segment] = "b";
      } else if (count === 9) {
        segmentToRealSegment[segment] = "f";
      } else if (count === 8) {
        count8.push(segment);
      } else if (count === 7) {
        count7.push(segment);
      }
    }
    const one = patterns.find((p) => p.length === 2)!;
    const seven = patterns.find((p) => p.length === 3)!;
    const four = patterns.find((p) => p.length === 4)!;
    // a and c both appear 8 times, but a is in 7
    const aSeg = count8.find((s) => seven.includes(s) && !one.includes(s))!;
    segmentToRealSegment[aSeg] = "a";
    const cSeg = count8.find((s) => s !== aSeg)!;
    segmentToRealSegment[cSeg] = "c";
    // d and g both appear 7 times, but d is in 4
    const dSeg = count7.find((s) => four.includes(s))!;
    segmentToRealSegment[dSeg] = "d";
    const gSeg = count7.find((s) => s !== dSeg)!;
    segmentToRealSegment[gSeg] = "g";
    let outputVal = "";
    for (const digit of output) {
      const realSegments = digit
        .split("")
        .map((seg) => segmentToRealSegment[seg])
        .sort()
        .join("");
      outputVal += digits[realSegments as keyof typeof digits];
    }
    total += parseInt(outputVal, 10);
  }
  console.log(total);
}
