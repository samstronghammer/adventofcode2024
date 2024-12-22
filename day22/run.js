#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toBigIntArrays(__dirname).map(arr => arr[0])

const mix = (n1, n2) => {
  return n1 ^ n2
}

const prune = (n) => {
  return n % 16777216n // 2^24
}

const evolve = (n) => {
  const n2 = prune(mix(n, n << 6n)) // 2^6
  const n3 = prune(mix(n2, n2 >> 5n)) // 2^5
  const n4 = prune(mix(n3, n3 << 11n)) // 2^11
  return n4
}

const calcAllArrays = () => {
  const arrs = []
  for (let a = -9; a <= 9; a++) {
    for (let b = -9; b <= 9; b++) {
      for (let c = -9; c <= 9; c++) {
        for (let d = -9; d <= 9; d++) {
          arrs.push([a, b, c, d])
        }
      }
    }
  }
  return arrs
}

// "-1,-1,0,2" => total number of bananas gotten with this sequence
const map = new Map()

const allArrays = calcAllArrays()
allArrays.forEach((arr) => {
  map.set(arr.join(","), 0n)
})

const iterate = (n, iterations) => {
  const numbers = [[n, n % 10n, undefined]]
  let newN = n
  const bestMap = new Map()
  for (let i = 0; i < iterations; i++) {
    newN = evolve(newN)
    numbers.push([newN, newN % 10n, newN % 10n - numbers.at(-1)[1]])
    const last4 = numbers.slice(-4).map(arr => arr[2])
    const last4Key = last4.join(",")
    if (!map.has(last4Key) || bestMap.has(last4Key)) continue
    bestMap.set(last4Key, numbers.at(-1)[1])
  }
  [...bestMap.entries()].forEach(([key, value]) => {
    map.set(key, map.get(key) + value)
  })
  return numbers
}

console.log(input.reduce((acc, val) => {
  return acc + iterate(val, 2000).at(-1)[0]
}, 0n).toString())

let bestSequence = undefined;
let bestValue = undefined;
[...map.entries()].forEach(([key, value]) => {
  if (!bestSequence || value > bestValue) {
    bestSequence = key
    bestValue = value
    return
  }
})
console.log(bestValue.toString())
