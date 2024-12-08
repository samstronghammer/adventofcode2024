#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toPoint2DMap(__dirname)
const antennae = new Map([...input.entries].filter(([_, char]) => char !== "."))

for (const antenna1 of input.entries) {
  console.log(antenna1)
}



console.log(p1)
console.log(p2)
