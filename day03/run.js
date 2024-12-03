#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toStringArray(__dirname).join("")
const all = [...input.matchAll(/(mul\((\d+),(\d+)\))|(do\(\))|(don't\(\))/g)]
all.sort((l, r) => l.index - r.index)

let doMul = true
let p1 = 0;
let p2 = 0;
for (const match of all) {
  if (match[0].startsWith("mul")) {
    const result = match[2] * match[3]
    p1 += result
    if (doMul) p2 += result
  } else if (match[0].startsWith("don't")) {
    doMul = false
  } else if (match[0].startsWith("do")) {
    doMul = true
  } else {
    throw new Error(`unrecognized: ${match[0]}`)
  }
}

console.log(p1)
console.log(p2)
