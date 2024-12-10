#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { Point2D } from '../util/Point2D.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = new Map([...InputUtils.toPoint2DMap(__dirname).entries()].map(([pointString, char]) => [pointString, parseInt(char)]))

const trailEndsReachable = new Map()
let p1 = 0
const numPaths = new Map()
let p2 = 0

for (let height = 9; height >= 0; height--) {
  input.forEach((value, key) => {
    if (value !== height) return
    if (value === 9) {
      trailEndsReachable.set(key, new Set([key]))
      numPaths.set(key, 1)
      return
    }
    const point = Point2D.fromString(key)
    const newReachable = new Set(point.adj4().reduce((acc, currPoint) => {
      if (input.get(currPoint.toString()) !== height + 1) return acc
      return acc.concat([...trailEndsReachable.get(currPoint.toString())])
    }, []))
    trailEndsReachable.set(key, newReachable)
    const score = point.adj4().reduce((acc, currPoint) => {
      if (input.get(currPoint.toString()) !== height + 1) return acc
      return acc + numPaths.get(currPoint.toString())
    }, 0)
    numPaths.set(key, score)
    if (height === 0) {
      p1 += newReachable.size
      p2 += score
    }
  })
}

console.log(p1)
console.log(p2)
