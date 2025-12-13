type State = {
  rooms: number[][];
  hallway: (number | undefined)[];
  energy: number;
};

function serialize(rooms: number[][], hallway: (number | undefined)[]) {
  return (
    rooms.map((r) => r.join(",")).join("|") +
    "||" +
    hallway.map((h) => h ?? ".").join("")
  );
}

function move(
  startRooms: number[][],
  startHallway: (number | undefined)[],
  roomSize: number,
) {
  let bestEnergy = Infinity;

  const stack: State[] = [
    { rooms: startRooms, hallway: startHallway, energy: 0 },
  ];

  const seen = new Map<string, number>();

  while (stack.length > 0) {
    const { rooms, hallway, energy } = stack.pop()!;

    if (energy >= bestEnergy) continue;

    const key = serialize(rooms, hallway);
    const prev = seen.get(key);
    if (prev !== undefined && prev <= energy) continue;
    seen.set(key, energy);

    // Every room is good
    if (
      rooms.every(
        (room, i) => room.length === roomSize && room.every((pod) => pod === i),
      )
    ) {
      bestEnergy = Math.min(bestEnergy, energy);
      continue;
    }

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

      for (let j = startingX - 1; j >= 0 && hallway[j] === undefined; j--) {
        // Directly in front of a room
        if ([2, 4, 6, 8].includes(j)) continue;

        const newRooms = [...rooms];
        newRooms[i] = room.slice(1);
        const newHallway = [...hallway];
        newHallway[j] = toMove;

        stack.push({
          rooms: newRooms,
          hallway: newHallway,
          energy: energy + (startingX - j) * 10 ** toMove + baseCost,
        });
      }
      for (
        let j = startingX + 1;
        j < hallway.length && hallway[j] === undefined;
        j++
      ) {
        if ([2, 4, 6, 8].includes(j)) continue;

        const newRooms = [...rooms];
        newRooms[i] = room.slice(1);
        const newHallway = [...hallway];
        newHallway[j] = toMove;

        stack.push({
          rooms: newRooms,
          hallway: newHallway,
          energy: energy + (j - startingX) * 10 ** toMove + baseCost,
        });
      }
    }

    // Move one from hallway to room
    for (let i = 0; i < hallway.length; i++) {
      const pod = hallway[i];
      if (pod === undefined) continue;
      const targetX = 2 + pod * 2;
      // Blocked
      if (
        (targetX < i &&
          hallway.slice(targetX, i).some((p) => p !== undefined)) ||
        (targetX > i &&
          hallway.slice(i + 1, targetX + 1).some((p) => p !== undefined))
      )
        continue;

      const room = rooms[pod];
      if (room.some((p) => p !== pod)) continue;

      const steps = Math.abs(i - targetX) + (roomSize - room.length);
      const cost = steps * 10 ** pod;

      const newRooms = [...rooms];
      newRooms[pod] = [pod, ...room];
      const newHallway = [...hallway];
      newHallway[i] = undefined;

      stack.push({
        rooms: newRooms,
        hallway: newHallway,
        energy: energy + cost,
      });
    }
  }

  return bestEnergy;
}

export function solve1(data: string[]): void {
  const rooms1 = data[2].match(/[A-D]/g)!;
  const rooms2 = data[3].match(/[A-D]/g)!;
  const rooms = rooms1.map((room, i) => [
    room.charCodeAt(0) - 65,
    rooms2[i].charCodeAt(0) - 65,
  ]);
  const hallway = Array(11).fill(undefined);
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
  const hallway = Array(11).fill(undefined);
  console.log(move(rooms, hallway, 4));
}
