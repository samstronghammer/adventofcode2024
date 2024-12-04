#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { ADJ_8, Point2D, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT } from '../util/Point2D.js';
import { shallowEqualArrays } from 'shallow-equal';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toPoint2DMap(__dirname)
const xmas = ["X", "M", "A", "S"]
let p1 = 0
let p2 = 0
input.forEach((char, pointString) => {
  const point = Point2D.fromString(pointString)
  if (char === "X") {
    ADJ_8.forEach(adj => {
      let curr = point;
      for (const char of xmas) {
        if (input.get(curr.toString()) !== char) return
        curr = curr.add(adj)
      }
      p1++
    })
  }
  if (char === "A") {
    const diag1 = [point.add(UP_LEFT), point.add(DOWN_RIGHT)].map(diag => input.get(diag.toString())).sort()
    const diag2 = [point.add(UP_RIGHT), point.add(DOWN_LEFT)].map(diag => input.get(diag.toString())).sort()
    if (shallowEqualArrays(diag1, ["M", "S"]) && shallowEqualArrays(diag2, ["M", "S"])) p2++
  }
})

console.log(p1)
console.log(p2)
