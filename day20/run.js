#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { ADJ_4, Point2D, RIGHT } from '../util/Point2D.js';
import graphlib from 'graphlib';
const Graph = graphlib.Graph
const alg = graphlib.alg
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toPoint2DMap(__dirname)
const startPointString = [...input.entries()].find(([_, value]) => value === "S")[0]
const endPointString = [...input.entries()].find(([_, value]) => value === "E")[0]
input.set(startPointString, ".")
input.set(endPointString, ".")

const locationToKey = (location, cheat) => {
  return `${location.toString()}|${cheat}`
}

const makeGraph = (forward) => {
  const graph = new Graph();
  [...input.entries()].forEach(([pointString, char]) => {
    const isWall = char !== "."
    const point = Point2D.fromString(pointString)
    const fromLocations = []
    if (isWall) {
      fromLocations.push([point, 1])
    } else {
      fromLocations.push([point, 0])
      fromLocations.push([point, 2])
    }
    fromLocations.forEach(location => graph.setNode(locationToKey(...location)))

    ADJ_4.forEach(adj => {
      const calcNext = ([fromPoint, cheat]) => {
        const nextPoint = forward ? fromPoint.add(adj) : fromPoint.sub(adj)
        const adjChar = input.get(nextPoint.toString())
        if (adjChar === undefined) return undefined
        if (adjChar === "#") {
          // # -> #
          if (isWall) return undefined
          // . -> #
          if (forward) {
            if (cheat !== 0) return undefined
            return locationToKey(nextPoint, 1)
          }
          if (cheat !== 2) return undefined
          return locationToKey(nextPoint, 1)
        }
        if (adjChar !== ".") throw new Error(`Unexpected char: ${adjChar}`)
        if (isWall) {
          // # -> .
          return locationToKey(nextPoint, forward ? 2 : 0)
        } else {
          // . -> .
          return locationToKey(nextPoint, cheat)
        }
      }
      fromLocations.forEach(location => {
        const next = calcNext(location)
        if (next) graph.setEdge(locationToKey(...location), next)
      })
    })
  });
  return graph
}

// TODO strip out cheat, don't need it for points.
// loc, 0 -- haven't used cheat yet. Can travel to 1s in walls.
// loc, 1 -- used cheat, currently in wall. Can only travel to 2s not in walls.
// loc, 2 -- used cheat, out of wall. Can only travel to 2s not in walls.
// Cheating collision for 2 picoseconds allows passing through ONE WALL

const graph = makeGraph(true)
const backwardGraph = makeGraph(false)

const startPointKey = locationToKey(Point2D.fromString(startPointString), 0)
const endPointKeyNoCheats = locationToKey(Point2D.fromString(endPointString), 0)

const calcDistances = (start, graph) => {
  return alg.dijkstra(graph, start)
}

const forwardDistances = calcDistances(startPointKey, graph)
const backwardDistancesNoCheats = calcDistances(endPointKeyNoCheats, backwardGraph)

const shortestNoCheating = forwardDistances[endPointKeyNoCheats].distance;

const countSavings = (cheatDistance) => {
  let count = 0;
  // TODO remove all "#" items, and instead iterate over everything within a manhattan distance of cheatDistance. Will be WAY less iterations. 
  [...input.entries()].forEach(([fromPointString, fromChar]) => {
    if (fromChar !== ".") return
    [...input.entries()].forEach(([toPointString, toChar]) => {
      if (toChar !== ".") return
      const fromPoint = Point2D.fromString(fromPointString)
      const toPoint = Point2D.fromString(toPointString)
      const manhattanDistance = fromPoint.manhattan(toPoint)
      if (manhattanDistance > cheatDistance) return
      const pathDistance = forwardDistances[locationToKey(fromPointString, 0)].distance + backwardDistancesNoCheats[locationToKey(toPointString, 0)].distance + manhattanDistance
      if (pathDistance < shortestNoCheating) {
        const saved = shortestNoCheating - pathDistance
        if (saved >= 100) {
          if (count % 100 === 0) console.log(count)
          count++
        }
      }
    })
  })
  return count
}

const count = countSavings(2)
console.log(count)

const count2 = countSavings(20)
console.log(count2)
