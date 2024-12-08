#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { Point2D } from '../util/Point2D.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toPoint2DMap(__dirname)
const antennae = new Map([...input.entries()].filter(([_, char]) => char !== "."))
const antinodes = new Set();
const antinodes2 = new Set();

for (const [point1String, char1] of antennae.entries()) {
  for (const [point2String, char2] of antennae.entries()) {
    if (char1 !== char2 || point1String === point2String) continue
    const point1 = Point2D.fromString(point1String)
    const point2 = Point2D.fromString(point2String)
    const delta = point1.sub(point2)
    const antinode1 = point1.add(delta).toString()
    const antinode2 = point2.sub(delta).toString()
    if (input.has(antinode1)) antinodes.add(antinode1)
    if (input.has(antinode2)) antinodes.add(antinode2)

    let currNode = point1
    while (input.has(currNode.toString())) {
      antinodes2.add(currNode.toString())
      currNode = currNode.sub(delta)
    }
    currNode = point2
    while (input.has(currNode.toString())) {
      antinodes2.add(currNode.toString())
      currNode = currNode.add(delta)
    }
  }
}

console.log(antinodes.size)
console.log(antinodes2.size)
