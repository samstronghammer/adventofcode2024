#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { Point2D } from '../util/Point2D.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toPoint2DMap(__dirname)
const pointsToSort = [...input.keys()]
const sortedPoints = new Set()

const pairToKey = (p1, d1) => `${p1.toString()}|${d1.toString()}`

let p1 = 0
let p2 = 0
while (pointsToSort.length > 0) {
  const nextPointString = pointsToSort.pop()
  if (sortedPoints.has(nextPointString)) continue
  const frontier = [nextPointString]
  const visited = new Set()
  const char = input.get(nextPointString)
  const perimeterPairs = []
  while (frontier.length > 0) {
    const frontierPointString = frontier.pop()
    if (visited.has(frontierPointString)) continue
    visited.add(frontierPointString)
    const frontierPoint = Point2D.fromString(frontierPointString)
    frontierPoint.adj4().forEach(adj => {
      const adjString = adj.toString()
      const otherChar = input.get(adjString)
      if (char === otherChar) {
        frontier.push(adjString)
      } else {
        perimeterPairs.push([frontierPoint, adj.sub(frontierPoint)])
      }
    })
  }
  visited.forEach(pointString => sortedPoints.add(pointString))
  const perimeter = perimeterPairs.length

  const visitedPerimeterPairs = new Set()
  let perimeter2 = 0
  while (perimeterPairs.length > 0) {
    const [perimeterPoint, perimeterDirection] = perimeterPairs.pop()
    if (visitedPerimeterPairs.has(pairToKey(perimeterPoint, perimeterDirection))) continue
    let currPoint = perimeterPoint
    let currPerimeterDirection = perimeterDirection
    let currPerimeter2 = 0
    while (!(currPoint.equals(perimeterPoint) && currPerimeterDirection.equals(perimeterDirection)) || currPerimeter2 < 4) {
      const perimeterChar = input.get(currPoint.add(currPerimeterDirection).toString())
      const moveDirection = currPerimeterDirection.turnRight()
      const moveChar = input.get(currPoint.add(moveDirection).toString())
      if (char === perimeterChar) {
        // inside shape
        currPoint = currPoint.add(currPerimeterDirection)
        currPerimeterDirection = currPerimeterDirection.turnLeft()
        currPerimeter2++
      } else if (char === moveChar) {
        // on perimeter, middle of wall
        visitedPerimeterPairs.add(pairToKey(currPoint, currPerimeterDirection))
        currPoint = currPoint.add(moveDirection)
      } else if (char !== moveChar) {
        // on perimeter, corner of wall
        visitedPerimeterPairs.add(pairToKey(currPoint, currPerimeterDirection))
        currPerimeterDirection = currPerimeterDirection.turnRight()
        currPerimeter2++
      }
    }
    perimeter2 += currPerimeter2
  }

  const area = visited.size
  p1 += perimeter * area
  p2 += perimeter2 * area
}

console.log(p1)
console.log(p2)
