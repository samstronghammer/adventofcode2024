#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toIntArrays(__dirname)

const isValidHelper = (result, partial, restOfRight, isP2) => {
  if (restOfRight.length === 0) return result === partial
  const [first, ...rest] = restOfRight
  return isValidHelper(result, partial + first, rest, isP2)
    || isValidHelper(result, partial * first, rest, isP2)
    || (isP2 && isValidHelper(result, parseInt(partial.toString() + first.toString()), rest, isP2))
}

const isValid = (calibrationEquation, isP2) => {
  const [result, start, ...right] = calibrationEquation
  return isValidHelper(result, start, right, isP2)
}

const p1 = input.filter((equation) => isValid(equation, false)).map(arr => arr[0]).reduce((acc, v) => acc + v, 0)
const p2 = input.filter((equation) => isValid(equation, true)).map(arr => arr[0]).reduce((acc, v) => acc + v, 0)

console.log(p1)
console.log(p2)
