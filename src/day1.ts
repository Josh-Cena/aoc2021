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
  const windows: number[] = [];
  for (let i = 0; i < numbers.length - 2; i++) {
    const sum = numbers[i] + numbers[i + 1] + numbers[i + 2];
    windows.push(sum);
  }
  let count = 0;
  for (let i = 1; i < windows.length; i++) {
    if (windows[i] > windows[i - 1]) {
      count++;
    }
  }
  console.log(count);
}
