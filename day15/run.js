#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { DOWN, LEFT, Point2D, RIGHT, UP } from '../util/Point2D.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toStringArray(__dirname)
const boardArray = []
let directions = ""
input.forEach(line => {
  if (line.startsWith("#")) {
    boardArray.push(line)
  } else if (line.length > 0) {
    directions += line
  }
})
const makeBoard = (boardArray) => {
  const board = InputUtils.arrayToPoint2DMap(boardArray)
  const startPosition = Point2D.fromString([...board.entries()].find(([_, value]) => value === "@")[0])
  board.set(startPosition.toString(), ".")
  return [board, startPosition]
}
const [board, startPosition] = makeBoard(boardArray)
const [board2, startPosition2] = makeBoard(boardArray.map(line => {
  return line.replace(/#/g, "##")
    .replace(/O/g, "[]")
    .replace(/\./g, "..")
    .replace(/@/g, "@.")
}))

const obj = { "^": UP, ">": RIGHT, "v": DOWN, "<": LEFT }
const charToDir = (c) => {
  if (c in obj) return obj[c]
  throw new Error("invalid direction char")
}

let currPos = startPosition
directions.split("").forEach(c => {
  const dir = charToDir(c)
  let nextPos = currPos.add(dir)
  let nextChar = board.get(nextPos.toString())
  switch (nextChar) {
    case ".":
      currPos = nextPos
      break;
    case "#":
      break;
    case "O":
      while (nextChar === "O") {
        nextPos = nextPos.add(dir)
        nextChar = board.get(nextPos.toString())
      }
      if (nextChar === "#") break
      if (nextChar === ".") {
        currPos = currPos.add(dir)
        board.set(nextPos.toString(), "O")
        board.set(currPos.toString(), ".")
      } else {
        throw new Error("invalid next char")
      }
      break;
    default:
      throw new Error("invalid next char")
  }
})

console.log([...board.entries()].reduce((acc, [key, value]) => {
  if (value !== "O") return acc
  const point = Point2D.fromString(key)
  return acc + point.r * 100 + point.c
}, 0))


const canPushBox = (pos, dir) => {
  const nextPos = pos.add(dir)
  const nextChar = board2.get(nextPos.toString())
  switch (nextChar) {
    case ".":
      return true
    case "#":
      return false
    case "[":
      if (dir.equals(RIGHT)) {
        return canPushBox(nextPos.add(RIGHT), dir)
      } else if (dir.equals(LEFT)) {
        throw new Error("Can't push left on this")
      } else {
        return canPushBox(nextPos, dir) && canPushBox(nextPos.add(RIGHT), dir)
      }
    case "]":
      if (dir.equals(RIGHT)) {
        throw new Error("Can't push right on this")
      } else if (dir.equals(LEFT)) {
        return canPushBox(nextPos.add(LEFT), dir)
      } else {
        return canPushBox(nextPos, dir) && canPushBox(nextPos.add(LEFT), dir)
      }
    default:
      console.log(nextChar)
      throw new Error("invalid next char")
  }
}

const doPushBox = (pos, dir) => {
  const nextPos = pos.add(dir)
  const nextChar = board2.get(nextPos.toString())
  switch (nextChar) {
    case ".":
      return
    case "#":
      throw new Error("invalid wall")
    case "[":
      if (dir.equals(RIGHT)) {
        doPushBox(nextPos.add(RIGHT), dir)
        board2.set(nextPos.toString(), ".")
        board2.set(nextPos.add(RIGHT).toString(), "[")
        board2.set(nextPos.add(RIGHT).add(RIGHT).toString(), "]")
      } else if (dir.equals(LEFT)) {
        throw new Error("Can't push left on this")
      } else {
        doPushBox(nextPos, dir)
        doPushBox(nextPos.add(RIGHT), dir)
        board2.set(nextPos.toString(), ".")
        board2.set(nextPos.add(RIGHT).toString(), ".")
        board2.set(nextPos.add(dir).toString(), "[")
        board2.set(nextPos.add(dir).add(RIGHT).toString(), "]")
      }
      break
    case "]":
      if (dir.equals(LEFT)) {
        doPushBox(nextPos.add(LEFT), dir)
        board2.set(nextPos.toString(), ".")
        board2.set(nextPos.add(LEFT).toString(), "]")
        board2.set(nextPos.add(LEFT).add(LEFT).toString(), "[")
      } else if (dir.equals(RIGHT)) {
        throw new Error("Can't push right on this")
      } else {
        doPushBox(pos.add(LEFT), dir)
      }
      break
    default:
      console.log(nextChar)
      throw new Error("invalid next char")
  }
}

let currPos2 = startPosition2
directions.split("").forEach(c => {
  const dir = charToDir(c)
  let nextPos = currPos2.add(dir)
  let nextChar = board2.get(nextPos.toString())
  switch (nextChar) {
    case ".":
      currPos2 = nextPos
      break;
    case "#":
      break;
    case "[":
    case "]":
      if (!canPushBox(currPos2, dir)) break
      doPushBox(currPos2, dir)
      currPos2 = nextPos
      break
    default:
      console.log(nextChar)
      throw new Error("invalid next char")
  }
})

console.log([...board2.entries()].reduce((acc, [key, value]) => {
  if (value !== "[") return acc
  const point = Point2D.fromString(key)
  return acc + point.r * 100 + point.c
}, 0))
