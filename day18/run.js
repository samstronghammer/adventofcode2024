#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { ADJ_4, Point2D } from '../util/Point2D.js';
import graphlib from 'graphlib';
const Graph = graphlib.Graph
const alg = graphlib.alg
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toIntArrays(__dirname).map(([c, r]) => new Point2D(r, c))

// For example:
// const MAX_DIM = 6
// const NUM_BYTES = 12
// For real data:
const MAX_DIM = 70
const NUM_BYTES = 1024

const pointsToCharMap = (points) => {
  const pointSet = new Set(points.map(p => p.toString()))
  const map = new Map()
  for (let r = 0; r <= MAX_DIM; r++) {
    for (let c = 0; c <= MAX_DIM; c++) {
      const s = new Point2D(r, c).toString()
      map.set(s, pointSet.has(s) ? "#" : ".")
    }
  }
  return map
}

const makeGraph = (charMap) => {
  const graph = new Graph();
  [...charMap.entries()].forEach(([pointString, char]) => {
    if (char !== ".") return
    const point = Point2D.fromString(pointString)
    const nodeKey = point.toString()
    graph.setNode(nodeKey)
    ADJ_4.forEach(adj => {
      const calcNext = () => {
        const nextPoint = point.add(adj)
        const adjChar = charMap.get(nextPoint.toString())
        if (adjChar === "#" || adjChar === undefined) return undefined
        if (adjChar !== ".") throw new Error(`Unexpected char: ${adjChar}`)
        return nextPoint.toString()
      }
      const next = calcNext()
      if (next) graph.setEdge(nodeKey, next)
    })
  });
  return graph
}

const calcDistance = (points) => {
  const charMap = pointsToCharMap(points)
  const graph = makeGraph(charMap)
  return alg.dijkstra(graph, new Point2D(0, 0).toString())[new Point2D(MAX_DIM, MAX_DIM).toString()].distance
}

let under = NUM_BYTES - 1
let over = input.length - 1
while (under + 1 < over) {
  const mid = (over + under) >> 1
  const distToEnd = calcDistance(input.slice(0, mid + 1))
  if (distToEnd === Number.POSITIVE_INFINITY) {
    over = mid
  } else {
    under = mid
  }
}

console.log(calcDistance(input.slice(0, NUM_BYTES)))
console.log(`${input[over].c},${input[over].r}`)
