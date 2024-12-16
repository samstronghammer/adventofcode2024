#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { DOWN, LEFT, Point2D, RIGHT, UP } from '../util/Point2D.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toStringArray(__dirname)
const dirObj = { "^": UP, ">": RIGHT, "v": DOWN, "<": LEFT }
const charToDir = (c) => {
  if (c in dirObj) return dirObj[c]
  throw new Error("invalid direction char")
}

const boardArray = input.filter(line => line.startsWith("#"))
const directions = input.filter(line => !line.startsWith("#") && line).join("").split("").map(charToDir)
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

const canPushBox = (pos, dir, boardMap) => {
  const nextPos = pos.add(dir)
  const nextChar = boardMap.get(nextPos.toString())
  switch (nextChar) {
    case ".":
      return true
    case "#":
      return false
    case "O":
      return canPushBox(nextPos, dir, boardMap)
    case "[":
      return (dir.equals(RIGHT) || canPushBox(nextPos, dir, boardMap)) && (dir.equals(LEFT) || canPushBox(nextPos.add(RIGHT), dir, boardMap))
    case "]":
      return canPushBox(pos.add(LEFT), dir, boardMap) // Defer to left side of block
    default:
      throw new Error(`invalid next char, canPushBox: ${nextChar}`)
  }
}

const doPushBox = (pos, dir, boardMap) => {
  const nextPos = pos.add(dir)
  const nextChar = boardMap.get(nextPos.toString())
  switch (nextChar) {
    case ".":
      return
    case "O":
      doPushBox(nextPos, dir, boardMap)
      boardMap.set(nextPos.toString(), ".")
      boardMap.set(nextPos.add(dir).toString(), "O")
      break
    case "[":
      !dir.equals(RIGHT) && doPushBox(nextPos, dir, boardMap) // if not pushing right, need to make room for this point
      !dir.equals(LEFT) && doPushBox(nextPos.add(RIGHT), dir, boardMap) // if not pushing left, need to make room for other part of block
      boardMap.set(nextPos.toString(), ".")
      boardMap.set(nextPos.add(RIGHT).toString(), ".")
      boardMap.set(nextPos.add(dir).toString(), "[")
      boardMap.set(nextPos.add(dir).add(RIGHT).toString(), "]")
      break
    case "]":
      doPushBox(pos.add(LEFT), dir, boardMap) // Defer to left side of block
      break
    default:
      throw new Error(`invalid next char, doPushBox: ${nextChar}`)
  }
}

const doDirections = (start, boardMap) => {
  let curr = start
  directions.forEach(dir => {
    const nextPos = curr.add(dir)
    const nextChar = boardMap.get(nextPos.toString())
    switch (nextChar) {
      case ".":
        curr = nextPos
        break;
      case "#":
        break;
      case "O":
      case "[":
      case "]":
        if (!canPushBox(curr, dir, boardMap)) break
        doPushBox(curr, dir, boardMap)
        curr = nextPos
        break
      default:
        throw new Error(`invalid next char, doDirections: ${nextChar}`)
    }
  })
  return boardMap
}

const scoreMap = (map) => [...map.entries()].reduce((acc, [key, value]) => {
  if (value !== "O" && value !== "[") return acc
  const point = Point2D.fromString(key)
  return acc + point.r * 100 + point.c
}, 0)

console.log(scoreMap(doDirections(startPosition, board)))
console.log(scoreMap(doDirections(startPosition2, board2)))
