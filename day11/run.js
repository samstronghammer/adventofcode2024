#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toIntArrays(__dirname)[0].map(n => BigInt(n))

//number of blinks, input number => number of output rocks 
//45,342483 => 2342434
const cache = new Map()

const memoBlink = (numBlinks, startNumber) => {
  if (numBlinks === 0) return 1
  const key = `${numBlinks}, ${startNumber}`
  if (!cache.has(key)) {
    const startNumberString = startNumber.toString()
    if (startNumber === 0n) {
      cache.set(key, memoBlink(numBlinks - 1, 1n))
    } else if (startNumberString.length % 2 === 0) {
      cache.set(key,
        memoBlink(numBlinks - 1, BigInt(startNumberString.substring(0, startNumberString.length / 2)))
        + memoBlink(numBlinks - 1, BigInt(startNumberString.substring(startNumberString.length / 2))))
    } else {
      cache.set(key, memoBlink(numBlinks - 1, 2024n * startNumber))
    }
  }
  return cache.get(key)
}

console.log(input.reduce((acc, v) => acc + memoBlink(25, v), 0))
console.log(input.reduce((acc, v) => acc + memoBlink(75, v), 0))
