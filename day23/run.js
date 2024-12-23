#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import graphlib from 'graphlib';
const Graph = graphlib.Graph
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toStringArray(__dirname)

const graph = new Graph()
input.forEach(s => {
  const [l, r] = s.split("-")
  graph.setNode(l)
  graph.setNode(r)
  graph.setEdge(l, r)
  graph.setEdge(r, l)
})

const connected = new Set()
graph.nodes().forEach(node => {
  if (!node.startsWith("t")) return
  const neighbors = graph.outEdges(node).map(edge => edge.w)
  for (let i = 0; i < neighbors.length - 1; i++) {
    for (let j = i + 1; j < neighbors.length; j++) {
      if (graph.hasEdge(neighbors[i], neighbors[j])) connected.add([node, neighbors[i], neighbors[j]].sort().join(","))
    }
  }
})

console.log(connected.size)

let minFailed = Number.POSITIVE_INFINITY
let minGroup = []
graph.nodes().forEach(node => {
  const neighbors = graph.outEdges(node).map(edge => edge.w)
  let numFailed = 0;
  for (let i = 0; i < neighbors.length - 1; i++) {
    for (let j = i + 1; j < neighbors.length; j++) {
      if (!graph.hasEdge(neighbors[i], neighbors[j])) numFailed++
    }
  }
  if (numFailed < minFailed) {
    minFailed = numFailed
    minGroup = [node]
  } else if (numFailed === minFailed) {
    minGroup.push(node)
  }
})

console.log(minGroup.sort().join(","))
