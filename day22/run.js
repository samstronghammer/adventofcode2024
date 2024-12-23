#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toBigIntArrays(__dirname).map(arr => arr[0])

const mix = (n1, n2) => n1 ^ n2
const mod2to24 = 2n ** 24n - 1n // 23 ones.
const prune = (n) => n & mod2to24

const evolve = (n) => {
  n = prune(mix(n, n << 6n))
  n = prune(mix(n, n >> 5n)) // 2^5
  return prune(mix(n, n << 11n)) // 2^11
}

// "-1,-1,0,2" => total number of bananas gotten with this sequence
const map = new Map()

const iterate = (n, iterations) => {
  const deltas = [undefined]
  let newN = n
  const bestMap = new Map()
  for (let i = 0; i < iterations; i++) {
    const oldDigit = newN % 10n
    newN = evolve(newN)
    const newDigit = newN % 10n
    deltas.push(newDigit - oldDigit)
    const last4Key = deltas.slice(-4).join(",")
    if (i < 3n || bestMap.has(last4Key)) continue
    bestMap.set(last4Key, newDigit)
  }
  bestMap.forEach((value, key) => {
    map.set(key, (map.get(key) ?? 0n) + value)
  })
  return newN
}

console.log(input.reduce((acc, val) => {
  return acc + iterate(val, 2000)
}, 0n).toString())

let bestValue = undefined;
map.forEach((value, _) => {
  if (bestValue !== undefined && value < bestValue) return
  bestValue = value
})
console.log(bestValue.toString())
