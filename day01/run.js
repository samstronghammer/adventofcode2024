#!/usr/local/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const output = InputUtils.toIntArrays(__dirname)
const leftList = output.map(arr => arr[0]).sort()
const rightList = output.map(arr => arr[1]).sort()

let total = 0
let similarity = 0

for (let i = 0; i < leftList.length; i++) {
  total += Math.abs(leftList[i] - rightList[i])
  // Didn't bother with a more efficient solution, such a short list
  similarity += leftList[i] * rightList.filter((num) => num === leftList[i]).length
}

console.log(total)
console.log(similarity)
