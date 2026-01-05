export function solve1(data: string[]): void {
  const numbers = data.map((line) => parseInt(line, 10));
  let count = 0;
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > numbers[i - 1]) {
      count++;
    }
  }
  console.log(count);
}

export function solve2(data: string[]): void {
  const numbers = data.map((line) => parseInt(line, 10));
  let count = 0;
  for (let i = 3; i < numbers.length; i++) {
    if (numbers[i] > numbers[i - 3]) {
      count++;
    }
  }
  console.log(count);
}
