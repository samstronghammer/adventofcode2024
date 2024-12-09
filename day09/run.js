#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toStringArray(__dirname)[0].split("").map(c => parseInt(c))
const disk = []
const fileMetadata = new Map()
input.forEach((layoutInfo, index) => {
  const isFile = index % 2 === 0
  const id = Math.floor(index / 2)
  disk.push(...Array(layoutInfo).fill(isFile ? id : "."))
  if (isFile) fileMetadata.set(id, {size: layoutInfo, index: disk.length - layoutInfo})
})

const disk2 = [...disk]

let startIndex = 0;
let endIndex = disk.length - 1
while (endIndex > startIndex) {
  if (disk[endIndex] === ".") {
    endIndex--
    continue
  }
  if (disk[startIndex] !== ".") {
    startIndex++
    continue
  }
  disk[startIndex] = disk[endIndex]
  disk[endIndex] = "."
}

for (let id = Math.max(...disk2.filter(item => item !== ".")); id > 0; id--) {
  const {size, index} = fileMetadata.get(id)
  let foundSize = 0
  for (let i = 0; i < index; i++) {
    if (disk2[i] === ".") {
      foundSize++
      if (foundSize === size) { // SUCCEEDED
        for (let j = i - foundSize + 1; j <= i; j++) {
          disk2[j] = id
        }
        for (let j = index; j < index + size; j++) {
          disk2[j] = "."
        }
        break
      }
    } else {
      foundSize = 0
    }
  }
}

const calcChecksum = (diskData) => diskData.reduce((acc, id, idx) => {
  if (id === ".") return acc
  return acc + id * idx
}, 0)

console.log(calcChecksum(disk))
console.log(calcChecksum(disk2))
