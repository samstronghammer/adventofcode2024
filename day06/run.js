#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { Point2D, UP } from '../util/Point2D.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toPoint2DMap(__dirname)
const guardPosition = Point2D.fromString([...input.entries()].find(([_, v]) => v === "^")[0])
input.set(guardPosition.toString(), ".")

const calcVisited = () => {
  let currPosition = Point2D.fromString(guardPosition.toString())
  let direction = UP
  const uniqueVisitedSet = new Set([currPosition.toString() + direction.toString()])
  const positionVisitedSet = new Set([currPosition.toString()])
  while (true) {
    const nextPosition = currPosition.add(direction)
    const char = input.get(nextPosition.toString())
    if (char === undefined) {
      break
    } else if (char === ".") {
      const newString = nextPosition.toString() + direction.toString()
      if (uniqueVisitedSet.has(newString)) return [positionVisitedSet, Number.POSITIVE_INFINITY]
      uniqueVisitedSet.add(newString)
      positionVisitedSet.add(nextPosition.toString())
      currPosition = nextPosition
    } else if (char === "#") {
      direction = direction.turnRight()
    } else {
      throw new Error(`invalid position: ${char}`)
    }
  }
  return [positionVisitedSet, positionVisitedSet.size]
} 

const [visited, p1] = calcVisited()
const blockPositions = [...visited].filter(pointString => {
  if (pointString === guardPosition.toString()) return false
  input.set(pointString, "#")
  const [_, numVisited] = calcVisited()
  input.set(pointString, ".")
  return numVisited === Number.POSITIVE_INFINITY
})

console.log(p1)
console.log(blockPositions.length)
