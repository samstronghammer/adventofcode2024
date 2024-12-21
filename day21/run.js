#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { MathUtils } from "../util/MathUtils.js"
import { fileURLToPath } from 'url';
import { Point2D } from '../util/Point2D.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toStringArray(__dirname)
const inputNumbers = InputUtils.toIntArrays(__dirname).map(arr => arr[0])

const numpad = {
  "7": new Point2D(0, 0),
  "8": new Point2D(0, 1),
  "9": new Point2D(0, 2),
  "4": new Point2D(1, 0),
  "5": new Point2D(1, 1),
  "6": new Point2D(1, 2),
  "1": new Point2D(2, 0),
  "2": new Point2D(2, 1),
  "3": new Point2D(2, 2),
  "0": new Point2D(3, 1),
  "A": new Point2D(3, 2),
}

const dirpad = {
  "^": new Point2D(0, 1),
  "A": new Point2D(0, 2),
  "<": new Point2D(1, 0),
  "v": new Point2D(1, 1),
  ">": new Point2D(1, 2),
}

const cache = new Map()

const convertString = (inputString, depth, p2) => {
  if (!p2 && depth === 3) return inputString.length
  if (p2 && depth === 26) return inputString.length
  const key = `${inputString},${depth},${p2}`
  if (cache.has(key)) return cache.get(key)
  const useNumpad = depth === 0
  const pad = useNumpad ? numpad : dirpad
  let currLoc = pad.A
  let count = 0;
  inputString.split("").forEach(char => {
    const nextLoc = pad[char]
    const delta = nextLoc.sub(currLoc)
    const addRows = (delta.r > 0 ? "v" : "^").repeat(Math.abs(delta.r))
    const addCols = (delta.c > 0 ? ">" : "<").repeat(Math.abs(delta.c))
    const rowsFirst = addRows + addCols + "A"
    const colsFirst = addCols + addRows + "A"
    if ((currLoc.r === 3 && nextLoc.c === 0 && useNumpad) || (currLoc.r === 0 && nextLoc.c === 0 && !useNumpad)) {
      count += convertString(rowsFirst, depth + 1, p2) // MUST DO ROWS FIRST
    } else if ((currLoc.c === 0 && nextLoc.r === 3 && useNumpad) || (currLoc.c === 0 && nextLoc.r === 0 && !useNumpad)) {
      count += convertString(colsFirst, depth + 1, p2) // MUST DO COLS FIRST
    } else {
      count += Math.min(convertString(rowsFirst, depth + 1, p2), convertString(colsFirst, depth + 1, p2))
    }
    currLoc = nextLoc
  })
  cache.set(key, count)
  return count
}

const calcSolution = (p2) => MathUtils.sumArray(input.map((inputString, index) => convertString(inputString, 0, p2) * inputNumbers[index]))
console.log(calcSolution(false))
console.log(calcSolution(true))
