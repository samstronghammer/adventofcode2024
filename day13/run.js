#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { lusolve, fraction } from 'mathjs'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toIntArrays(__dirname).map(arr => arr.map(n => fraction(n)))

const calcCost = (machine) => {
  const result = lusolve([[machine.A[0], machine.B[0]], [machine.A[1], machine.B[1]]], machine.prize)
  const aPushes = result[0][0]
  const bPushes = result[1][0]
  if (aPushes.d === 1n && bPushes.d === 1n) {
    return aPushes.n * 3n + bPushes.n
  }
  return 0n
}

let p1 = 0n
let p2 = 0n
for (let i = 0; i < input.length; i += 4) {
  const machine = {
    A: input[i],
    B: input[i + 1],
    prize: input[i + 2]
  } 
  p1 += calcCost(machine)
  machine.prize = machine.prize.map(n => n.add(10000000000000))
  p2 += calcCost(machine)
}
console.log(p1.toString())
console.log(p2.toString())
