#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { MathUtils } from '../util/MathUtils.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toStringArray(__dirname)
const haveTowels = input[0].split(", ")
const testTowels = input.slice(2)

const cache = new Map([["", 1]])
const testTowel = (towel) => {
  if (cache.has(towel)) return cache.get(towel)
  const count = MathUtils.sumArray(haveTowels.map(haveTowel => {
    if (towel.startsWith(haveTowel)) return testTowel(towel.substring(haveTowel.length))
    return 0
  }))
  cache.set(towel, count)
  return count
}

console.log(testTowels.filter(towel => testTowel(towel) > 0).length)
console.log(MathUtils.sumArray(testTowels.map(testTowel)))
