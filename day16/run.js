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

const locationToKey = (location, dir) => {
  if (location.toString() === endPointString) return endPointString
  return `${location.toString()}|${dir.toString()}`
}

const makeGraph = (forward) => {
  const graph = new Graph();
  [...input.entries()].forEach(([pointString, char]) => {
    if (char !== ".") return
    const point = Point2D.fromString(pointString)
    ADJ_4.forEach(adj => {
      const nodeKey = locationToKey(point, adj)
      const calcNext = () => {
        const nextPoint = forward ? point.add(adj) : point.sub(adj)
        const adjChar = input.get(nextPoint.toString())
        if (adjChar === "#") return undefined
        if (adjChar !== ".") throw new Error(`Unexpected char: ${adjChar}`)
        return locationToKey(nextPoint, adj)
      }
      const leftTurn = locationToKey(point, adj.turnLeft())
      graph.setEdge(nodeKey, leftTurn, "turn")
      const rightTurn = locationToKey(point, adj.turnRight())
      graph.setEdge(nodeKey, rightTurn, "turn")
      const next = calcNext()
      if (next) graph.setEdge(nodeKey, next, "move")
      graph.setNode(nodeKey)
    })
  });
  return graph
}

const graph = makeGraph(true)
const backwardGraph = makeGraph(false)

const startPointKey = locationToKey(Point2D.fromString(startPointString), RIGHT)
const calcDistances = (start, graph) => {
  return alg.dijkstra(graph, start, (e) => graph.edge(e.v, e.w) === "turn" ? 1000 : 1)
}

const forwardDistances = calcDistances(startPointKey, graph)
const shortestDistance = forwardDistances[endPointString].distance
console.log(shortestDistance)

const backwardDistances = calcDistances(endPointString, backwardGraph) 

const numOnShortestPath = new Set(graph.nodes().filter(node => {
  return forwardDistances[node].distance + backwardDistances[node].distance === shortestDistance
}).map(s => s.split("|")[0])).size

console.log(numOnShortestPath)
