import {
  MinPriorityQueue,
  type PriorityQueueItem,
} from "@datastructures-js/priority-queue";

type State = {
  rooms: number[][];
  hallway: (number | undefined)[];
};

function serialize(rooms: number[][], hallway: (number | undefined)[]) {
  return (
    rooms.map((r) => r.join(",")).join("|") +
    "||" +
    hallway.map((h) => h ?? ".").join("")
  );
}

function* nextStates(
  rooms: number[][],
  hallway: (number | undefined)[],
  roomSize: number,
) {
  // Move one from room to hallway
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];

    // Empty or already good
    if (
      room.length === 0 ||
      (room.length === roomSize && room.every((p) => p === i))
    )
      continue;

    const toMove = room[0];
    const startingX = 2 + i * 2;
    // Cost to enter the hallway
    const baseCost = (roomSize + 1 - room.length) * 10 ** toMove;
    let leftMost = startingX - 1;
    while (leftMost >= 0 && hallway[leftMost] === undefined) leftMost--;

    for (
      let j = leftMost + 1;
      j < hallway.length && hallway[j] === undefined;
      j++
    ) {
      // Directly in front of a room
      if ([2, 4, 6, 8].includes(j)) continue;

      const newRooms = [...rooms];
      newRooms[i] = room.slice(1);
      const newHallway = [...hallway];
      newHallway[j] = toMove;
      yield {
        rooms: newRooms,
        hallway: newHallway,
        cost: Math.abs(startingX - j) * 10 ** toMove + baseCost,
      };
    }
  }

  // Move one from hallway to room
  for (let i = 0; i < hallway.length; i++) {
    const pod = hallway[i];
    if (pod === undefined) continue;
    const targetX = 2 + pod * 2;
    // Blocked
    if (
      (targetX < i && hallway.slice(targetX, i).some((p) => p !== undefined)) ||
      (targetX > i &&
        hallway.slice(i + 1, targetX + 1).some((p) => p !== undefined))
    )
      continue;

    const room = rooms[pod];
    if (room.some((p) => p !== pod)) continue;

    const newRooms = [...rooms];
    newRooms[pod] = [pod, ...room];
    const newHallway = [...hallway];
    newHallway[i] = undefined;
    yield {
      rooms: newRooms,
      hallway: newHallway,
      cost: (Math.abs(i - targetX) + (roomSize - room.length)) * 10 ** pod,
    };
  }
}

function move(
  startRooms: number[][],
  startHallway: (number | undefined)[],
  roomSize: number,
) {
  const costs = new Map<string, number>();
  costs.set(serialize(startRooms, startHallway), 0);
  const pq = new MinPriorityQueue<State>();
  pq.enqueue({ rooms: startRooms, hallway: startHallway }, 0);

  while (!pq.isEmpty()) {
    const {
      priority: energy,
      element: { rooms, hallway },
    } = pq.dequeue() as PriorityQueueItem<State>;

    // Every room is good
    if (
      rooms.every(
        (room, i) => room.length === roomSize && room.every((pod) => pod === i),
      )
    ) {
      return energy;
    }

    for (const { rooms: newRooms, hallway: newHallway, cost } of nextStates(
      rooms,
      hallway,
      roomSize,
    )) {
      const newEnergy = energy + cost;
      const serialized = serialize(newRooms, newHallway);
      if (!costs.has(serialized) || newEnergy < costs.get(serialized)!) {
        costs.set(serialized, newEnergy);
        pq.enqueue({ rooms: newRooms, hallway: newHallway }, newEnergy);
      }
    }
  }
  throw new Error("No solution found");
}

export function solve1(data: string[]): void {
  const rooms1 = data[2].match(/[A-D]/g)!;
  const rooms2 = data[3].match(/[A-D]/g)!;
  const rooms = rooms1.map((room, i) => [
    room.charCodeAt(0) - 65,
    rooms2[i].charCodeAt(0) - 65,
  ]);
  const hallway: (number | undefined)[] = Array(11).fill(undefined);
  console.log(move(rooms, hallway, 2));
}

export function solve2(data: string[]): void {
  const extra = [
    [3, 3],
    [2, 1],
    [1, 0],
    [0, 2],
  ];
  const rooms1 = data[2].match(/[A-D]/g)!;
  const rooms2 = data[3].match(/[A-D]/g)!;
  const rooms = rooms1.map((room, i) => [
    room.charCodeAt(0) - 65,
    ...extra[i],
    rooms2[i].charCodeAt(0) - 65,
  ]);
  const hallway: (number | undefined)[] = Array(11).fill(undefined);
  console.log(move(rooms, hallway, 4));
}
