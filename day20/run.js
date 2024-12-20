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

const makeGraph = () => {
  const graph = new Graph();
  [...input.entries()].forEach(([pointString, char]) => {
    if (char !== ".") return
    const point = Point2D.fromString(pointString)
    graph.setNode(pointString)
    ADJ_4.forEach(adj => {
      const calcNext = () => {
        const nextPoint = point.add(adj)
        const adjChar = input.get(nextPoint.toString())
        if (adjChar === "#") return undefined
        if (adjChar !== ".") throw new Error(`Unexpected char: ${adjChar}`)
        return nextPoint.toString()
      }
      const next = calcNext()
      if (next) graph.setEdge(pointString, next)
    })
  });
  return graph
}

const graph = makeGraph()

const calcDistances = (start, graph) => alg.dijkstra(graph, start)

const forwardDistances = calcDistances(startPointString, graph)
const backwardDistances = calcDistances(endPointString, graph)
const shortestDistance = forwardDistances[endPointString].distance;

const countSavings = (cheatDistance) => {
  let count = 0;
  [...input.entries()].forEach(([fromPointString, fromChar]) => {
    if (fromChar !== ".") return
    const fromPoint = Point2D.fromString(fromPointString);
    // Iterate over every point within manhattan distance of cheatDistance
    for (let dr = -cheatDistance; dr <= cheatDistance; dr++) {
      const distanceRemaining = cheatDistance - Math.abs(dr)
      for (let dc = -distanceRemaining; dc <= distanceRemaining; dc++) {
        const toPoint = fromPoint.add(new Point2D(dr, dc))
        const toPointString = toPoint.toString()
        const toChar = input.get(toPointString)
        if (toChar !== ".") continue
        const pathDistance = forwardDistances[fromPointString].distance + backwardDistances[toPointString].distance + Math.abs(dr) + Math.abs(dc)
        if (shortestDistance - pathDistance >= 100) count++
      }
    }
  })
  return count
}

const count = countSavings(2)
console.log(count)

const count2 = countSavings(20)
console.log(count2)
