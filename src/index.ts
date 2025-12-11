import FS from "node:fs";

const day = process.argv[2];
const prob = process.argv[3];
const input = process.argv.length > 4 ? process.argv[4] : "real";
const filename = `./inputs/day${day}/${input}.txt`;
const content = FS.readFileSync(filename, "utf-8").trim().split("\n");

const mod = require(`./day${day}.js`) as {
  solve1: (input: string[]) => void;
  solve2: (input: string[]) => void;
};
const solver = mod[`solve${prob as "1" | "2"}`];
solver(content);
