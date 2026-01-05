function baseNumPaths(
  graph: Map<string, string[]>,
  current: string,
  visited: Set<string>,
  allowDoubleVisit: boolean,
) {
  if (current === "end") return 1;
  const isSmallCave = current.toLowerCase() === current;
  const newVisited = new Set(visited);
  if (isSmallCave) {
    if (visited.has(current)) {
      if (!allowDoubleVisit || current === "start") return 0;
      allowDoubleVisit = false;
    }
    newVisited.add(current);
  }
  let total = 0;
  for (const neighbor of graph.get(current) || []) {
    total += numPaths(graph, neighbor, newVisited, allowDoubleVisit);
  }
  return total;
}

function makeCachedWrapper(): typeof baseNumPaths {
  const cache = new Map<string, number>();
  return (graph, current, visited, allowDoubleVisit) => {
    const key = `${current}|${[...visited]
      .sort()
      .join(",")}|${allowDoubleVisit}`;
    if (cache.has(key)) return cache.get(key)!;
    const result = baseNumPaths(graph, current, visited, allowDoubleVisit);
    cache.set(key, result);
    return result;
  };
}

const numPaths = makeCachedWrapper();

function parseGraph(data: string[]) {
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
  return graph;
}

export function solve1(data: string[]): void {
  const graph = parseGraph(data);
  const totalPaths = numPaths(graph, "start", new Set(), false);
  console.log(totalPaths);
}

export function solve2(data: string[]): void {
  const graph = parseGraph(data);
  const totalPaths = numPaths(graph, "start", new Set(), true);
  console.log(totalPaths);
}
