type InputNum = number | [InputNum, InputNum];
type SnailNumPair = { type: "pair"; left: SnailNum; right: SnailNum; parent: SnailNumPair | null };
type SnailNumNum = { type: "num"; value: number; parent: SnailNumPair | null };
type SnailNum = SnailNumPair | SnailNumNum;

function buildSnailNum(obj: InputNum, parent: SnailNumPair | null): SnailNum {
  if (typeof obj === "number") {
    return { type: "num", value: obj, parent };
  }
  const pair: SnailNumPair = {
    type: "pair",
    left: buildSnailNum(obj[0], null),
    right: buildSnailNum(obj[1], null),
    parent,
  };
  pair.left.parent = pair;
  pair.right.parent = pair;
  return pair;
}

function explode(a: SnailNum, depth: number): boolean {
  if (a.type === "num") {
    return false;
  }
  if (depth < 4 || a.left.type !== "num" || a.right.type !== "num") {
    return explode(a.left, depth + 1) || explode(a.right, depth + 1);
  }
  let left: SnailNum | null = null;
  let cur: SnailNum | null = a;
  while (cur.parent) {
    if (cur.parent.left !== cur) {
      left = cur.parent.left;
      break;
    }
    cur = cur.parent;
  }
  if (left !== null) {
    while (left.type === "pair") {
      left = left.right;
    }
    left.value += a.left.value;
  }
  let right: SnailNum | null = null;
  cur = a;
  while (cur.parent) {
    if (cur.parent.right !== cur) {
      right = cur.parent.right;
      break;
    }
    cur = cur.parent;
  }
  if (right !== null) {
    while (right.type === "pair") {
      right = right.left;
    }
    right.value += a.right.value;
  }
  const newNum: SnailNumNum = { type: "num", value: 0, parent: a.parent };
  if (a.parent) {
    if (a.parent.left === a) {
      a.parent.left = newNum;
    } else {
      a.parent.right = newNum;
    }
  }
  return true;
}

function split(a: SnailNum): boolean {
  if (a.type !== "num") {
    return split(a.left) || split(a.right);
  }
  if (a.value < 10) {
    return false;
  }
  const leftValue = Math.floor(a.value / 2);
  const rightValue = Math.ceil(a.value / 2);
  const newPair: SnailNumPair = {
    type: "pair",
    left: { type: "num", value: leftValue, parent: null },
    right: { type: "num", value: rightValue, parent: null },
    parent: a.parent,
  };
  newPair.left.parent = newPair;
  newPair.right.parent = newPair;
  if (a.parent) {
    if (a.parent.left === a) {
      a.parent.left = newPair;
    } else {
      a.parent.right = newPair;
    }
  }
  return true;
}

function add(a: SnailNum, b: SnailNum): SnailNum {
  const p: SnailNumPair = { type: "pair", left: a, right: b, parent: null };
  a.parent = p;
  b.parent = p;
  while (true) {
    if (explode(p, 0)) continue;
    if (split(p)) continue;
    break;
  }
  return p;
}

function magnitude(a: SnailNum): number {
  if (a.type === "num") {
    return a.value;
  }
  return 3 * magnitude(a.left) + 2 * magnitude(a.right);
}

export function solve1(data: string[]): void {
  const nums = data.map((line) => JSON.parse(line) as InputNum);
  const res = nums.slice(1).reduce((acc, curr) => {
    const currNum = buildSnailNum(curr, null);
    return add(acc, currNum);
  }, buildSnailNum(nums[0], null));
  console.log(magnitude(res));
}

export function solve2(data: string[]): void {
  const nums = data.map((line) => JSON.parse(line) as InputNum);
  let maxMag = 0;
  for (const a of nums) {
    for (const b of nums) {
      if (a === b) continue;
      const sum = add(buildSnailNum(a, null), buildSnailNum(b, null));
      const mag = magnitude(sum);
      if (mag > maxMag) {
        maxMag = mag;
      }
    }
  }
  console.log(maxMag);
}
