const cache = new Map<string, number>();

function numPaths(
  graph: Map<string, string[]>,
  current: string,
  visited: Set<string>,
  hasDoubleVisit: boolean,
) {
  if (current === "end") {
    return 1;
  }
  const cacheKey = `${current}|${[...visited]
    .sort()
    .join(",")}|${hasDoubleVisit}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  let total = 0;
  for (const neighbor of graph.get(current) || []) {
    const isSmallCave = neighbor.toLowerCase() === neighbor;
    if (isSmallCave && visited.has(neighbor)) {
      if (hasDoubleVisit && neighbor !== "start") {
        // Allow one small cave to be visited twice
        total += numPaths(graph, neighbor, visited, false);
      }
      continue;
    }
    const newVisited = new Set(visited);
    if (isSmallCave) {
      newVisited.add(neighbor);
    }
    total += numPaths(graph, neighbor, newVisited, hasDoubleVisit);
  }
  cache.set(cacheKey, total);
  return total;
}

export function solve1(data: string[]): void {
  const graph = new Map<string, string[]>();
  for (const line of data) {
    const [a, b] = line.split("-");
    if (!graph.has(a)) {
      graph.set(a, []);
    }
    graph.get(a)!.push(b);
    if (!graph.has(b)) {
      graph.set(b, []);
    }
    graph.get(b)!.push(a);
  }
  const totalPaths = numPaths(graph, "start", new Set(["start"]), false);
  console.log(totalPaths);
}

export function solve2(data: string[]): void {
  const graph = new Map<string, string[]>();
  for (const line of data) {
    const [a, b] = line.split("-");
    if (!graph.has(a)) {
      graph.set(a, []);
    }
    graph.get(a)!.push(b);
    if (!graph.has(b)) {
      graph.set(b, []);
    }
    graph.get(b)!.push(a);
  }
  const totalPaths = numPaths(graph, "start", new Set(["start"]), true);
  console.log(totalPaths);
}
