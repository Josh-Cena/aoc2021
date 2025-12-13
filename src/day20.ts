function enhanceImage(
  image: boolean[][],
  algo: string,
  defaultPixel: boolean,
): boolean[][] {
  const newImage: boolean[][] = [];
  const height = image.length;
  const width = image[0].length;

  for (let y = -1; y <= height; y++) {
    const newRow: boolean[] = [];
    for (let x = -1; x <= width; x++) {
      let index = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          index <<= 1;
          const ny = y + dy;
          const nx = x + dx;
          index |= Number(image[ny]?.[nx] ?? defaultPixel);
        }
      }
      newRow.push(algo[index] === "#");
    }
    newImage.push(newRow);
  }

  return newImage;
}

function solve(data: string[], n: number): void {
  const algo = data[0];
  const image = data
    .slice(2)
    .map((line) => line.split("").map((c) => c === "#"));
  let enhancedImage = image;
  let defaultPixel = false;
  for (let i = 0; i < n; i++) {
    enhancedImage = enhanceImage(enhancedImage, algo, defaultPixel);
    if (algo[0] === "#" && algo.at(-1) === ".") {
      defaultPixel = !defaultPixel;
    } else if (algo[0] === "#") {
      defaultPixel = true;
    }
  }
  const litPixels = enhancedImage.reduce(
    (sum, row) =>
      sum + row.reduce((rowSum, pixel) => rowSum + Number(pixel), 0),
    0,
  );
  console.log(litPixels);
}

export function solve1(data: string[]): void {
  solve(data, 2);
}

export function solve2(data: string[]): void {
  solve(data, 50);
}
