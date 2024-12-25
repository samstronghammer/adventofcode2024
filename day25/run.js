#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { Point2D } from '../util/Point2D.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toStringArray(__dirname)
const keys = []
const locks = []
while (input.length > 0) {
  const newThing = input.splice(0, 7)
  if (input[0] === "") input.splice(0, 1)
  const map = InputUtils.arrayToPoint2DMap(newThing)
  if (newThing[0] === "#####") locks.push(map)
  else keys.push(map)
}

const fits = (keyMap, lockMap) => {
  for (let row = 1; row <= 5; row++) {
    for (let col = 0; col <= 4; col++) {
      const point = new Point2D(row, col)
      const pointString = point.toString()
      if (keyMap.get(pointString) === "#" && lockMap.get(pointString) === "#") return false
    }
  }
  return true
}

let count = 0
keys.forEach(key => {
  locks.forEach(lock => {
    if (fits(key, lock)) count++
  })
})

console.log(count)
