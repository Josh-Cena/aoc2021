import {
  MinPriorityQueue,
  type PriorityQueueItem,
} from "@datastructures-js/priority-queue";

function neighbors(x: number, y: number, width: number, height: number) {
  const result: [number, number][] = [];
  for (const [nx, ny] of [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]) {
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      result.push([nx, ny]);
    }
  }
  return result;
}

function dijkstra(grid: number[][]): number {
  const width = grid[0].length;
  const height = grid.length;
  const dist = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Infinity),
  );
  dist[0][0] = 0;
  const pq = new MinPriorityQueue<[number, number]>();
  pq.enqueue([0, 0], 0);
  while (!pq.isEmpty()) {
    const { priority, element } = pq.dequeue() as PriorityQueueItem<
      [number, number]
    >;
    for (const [nx, ny] of neighbors(element[0], element[1], width, height)) {
      const newCost = priority + grid[ny][nx];
      if (newCost < dist[ny][nx]) {
        dist[ny][nx] = newCost;
        pq.enqueue([nx, ny], newCost);
      }
    }
  }
  return dist[height - 1][width - 1];
}

export function solve1(data: string[]): void {
  const grid = data.map((line) => line.split("").map((ch) => parseInt(ch, 10)));
  const result = dijkstra(grid);
  console.log(result);
}

export function solve2(data: string[]): void {
  const grid = data.map((line) => line.split("").map((ch) => parseInt(ch, 10)));
  const width = grid[0].length;
  const height = grid.length;
  const newWidth = width * 5;
  const newHeight = height * 5;
  const newGrid: number[][] = Array.from({ length: newHeight }, () =>
    Array.from({ length: newWidth }, () => 0),
  );
  for (let ty = 0; ty < 5; ty++) {
    for (let tx = 0; tx < 5; tx++) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let newValue = grid[y][x] + tx + ty;
          if (newValue > 9) {
            newValue = ((newValue - 1) % 9) + 1;
          }
          newGrid[ty * height + y][tx * width + x] = newValue;
        }
      }
    }
  }
  const result = dijkstra(newGrid);
  console.log(result);
}
