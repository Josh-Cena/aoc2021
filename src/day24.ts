function getConstraints(data: string[]): [number, number, number][] {
  const chunks = data.join("\n").split("inp w\n");
  const nVals = chunks.filter(Boolean).map((chunk) => {
    const lines = chunk.split("\n");
    return [lines[3], lines[4], lines[14]].map((line, i) =>
      Number(line.split(" ")[2]),
    );
  });
  // console.log(
  //   nVals
  //     .map((ns) =>
  //       ns.map((n, i) => `n${i} = ${n.toString().padStart(3)}`).join("    "),
  //     )
  //     .join("\n"),
  // );
  const stack: [number, number][] = [];
  // Each constraint of the form w[i] - w[j] = n (i > j)
  const constraints: [number, number, number][] = [];
  for (const [i, [n0, n1, n2]] of nVals.entries()) {
    if (n0 === 1) {
      // Push-chunk
      stack.push([i, n2]);
    } else {
      // Pop-chunk
      const [iPush, n2Push] = stack.pop()!;
      constraints.push([i, iPush, n2Push + n1]);
    }
  }
  return constraints;
}

export function solve1(data: string[]) {
  const constraints = getConstraints(data);
  const optW = Array(14).fill(0);
  for (const [i, iPush, n] of constraints) {
    // console.log(`w[${i}] - w[${iPush}] = ${n}`);
    optW[i] = Math.min(9, 9 + n);
    optW[iPush] = Math.min(9, 9 - n);
  }
  console.log(optW.join(""));
}

export function solve2(data: string[]) {
  const constraints = getConstraints(data);
  const optW = Array(14).fill(9);
  for (const [i, iPush, n] of constraints) {
    optW[i] = Math.max(1, 1 + n);
    optW[iPush] = Math.max(1, 1 - n);
  }
  console.log(optW.join(""));
}
