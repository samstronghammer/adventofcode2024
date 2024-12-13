#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { lusolve, fraction } from 'mathjs'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toIntArrays(__dirname).map(arr => arr.map(n => fraction(n)))

const calcCost = (lh, prize) => {
  const [[aPushes], [bPushes]] = lusolve(lh, prize)
  if (aPushes.d === 1n && bPushes.d === 1n) return aPushes.n * 3n + bPushes.n
  return 0n
}

let p1 = 0n
let p2 = 0n
for (let i = 0; i < input.length; i += 4) {
  const lh = [[input[i][0], input[i + 1][0]], [input[i][1], input[i + 1][1]]]
  const prize = input[i + 2]
  p1 += calcCost(lh, prize)
  p2 += calcCost(lh, prize.map(n => n.add(10000000000000)))
}
console.log(p1.toString())
console.log(p2.toString())
