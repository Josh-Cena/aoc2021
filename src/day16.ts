type Packet =
  | {
      version: number;
      typeId: 4;
      value: number;
    }
  | {
      version: number;
      typeId: 0 | 1 | 2 | 3 | 5 | 6 | 7;
      subPackets: Packet[];
    };

function parsePacket(
  input: string,
  index: number,
): { packet: Packet; newIndex: number } {
  const version = parseInt(input.slice(index, index + 3), 2);
  const typeId = parseInt(input.slice(index + 3, index + 6), 2) as
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7;
  let currentIndex = index + 6;
  if (typeId === 4) {
    let valueBits = "";
    while (true) {
      const group = input.slice(currentIndex, currentIndex + 5);
      valueBits += group.slice(1);
      currentIndex += 5;
      if (group[0] === "0") break;
    }
    const value = parseInt(valueBits, 2);
    return { packet: { version, typeId, value }, newIndex: currentIndex };
  } else {
    const lengthTypeId = input[currentIndex];
    currentIndex += 1;
    const subPackets: Packet[] = [];
    if (lengthTypeId === "0") {
      const totalLength = parseInt(
        input.slice(currentIndex, currentIndex + 15),
        2,
      );
      currentIndex += 15;
      const end = currentIndex + totalLength;
      while (currentIndex < end) {
        const result = parsePacket(input, currentIndex);
        subPackets.push(result.packet);
        currentIndex = result.newIndex;
      }
    } else {
      const subPacketsNum = parseInt(
        input.slice(currentIndex, currentIndex + 11),
        2,
      );
      currentIndex += 11;
      for (let i = 0; i < subPacketsNum; i++) {
        const result = parsePacket(input, currentIndex);
        subPackets.push(result.packet);
        currentIndex = result.newIndex;
      }
    }
    return { packet: { version, typeId, subPackets }, newIndex: currentIndex };
  }
}

export function solve1(data: string[]): void {
  const bin = data[0]
    .split("")
    .map((c) => parseInt(c, 16).toString(2).padStart(4, "0"))
    .join("");
  const { packet } = parsePacket(bin, 0);
  function sumVersions(packet: Packet): number {
    let sum = packet.version;
    if (packet.typeId !== 4) {
      for (const subPacket of packet.subPackets) {
        sum += sumVersions(subPacket);
      }
    }
    return sum;
  }
  console.log(sumVersions(packet));
}

const ops = [
  (values: number[]) => values.reduce((a, b) => a + b, 0),
  (values: number[]) => values.reduce((a, b) => a * b, 1),
  (values: number[]) => Math.min(...values),
  (values: number[]) => Math.max(...values),
  (values: number[]) => values[0],
  (values: number[]) => (values[0] > values[1] ? 1 : 0),
  (values: number[]) => (values[0] < values[1] ? 1 : 0),
  (values: number[]) => (values[0] === values[1] ? 1 : 0),
];

export function solve2(data: string[]): void {
  const bin = data[0]
    .split("")
    .map((c) => parseInt(c, 16).toString(2).padStart(4, "0"))
    .join("");
  const { packet } = parsePacket(bin, 0);
  function evaluate(packet: Packet): number {
    if (packet.typeId === 4) {
      return packet.value;
    } else {
      const values = packet.subPackets.map(evaluate);
      return ops[packet.typeId](values);
    }
  }
  console.log(evaluate(packet));
}
