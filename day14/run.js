#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { Point2D } from '../util/Point2D.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toIntArrays(__dirname).map(([px, py, vx, vy]) => ({ p: new Point2D(py, px), v: new Point2D(vy, vx) }))

const moveRobot = (robot, numSeconds, space) => {
  const newRobotR = (((robot.p.r + robot.v.r * numSeconds) % space.r) + space.r) % space.r
  const newRobotC = (((robot.p.c + robot.v.c * numSeconds) % space.c) + space.c) % space.c
  return { p: new Point2D(newRobotR, newRobotC), v: robot.v }
}

const countQuadrants = (robots, space) => {
  const val = { tl: 0, tr: 0, bl: 0, br: 0 }
  const rBreak = (space.r - 1) / 2
  const cBreak = (space.c - 1) / 2
  robots.forEach(robot => {
    const isTop = robot.p.r < rBreak
    const isLeft = robot.p.c < cBreak
    const isBottom = robot.p.r > rBreak
    const isRight = robot.p.c > cBreak
    val.tl += isTop && isLeft ? 1 : 0
    val.tr += isTop && isRight ? 1 : 0
    val.bl += isBottom && isLeft ? 1 : 0
    val.br += isBottom && isRight ? 1 : 0
  })
  return val.tl * val.tr * val.bl * val.br
}

const window = new Point2D(103, 101)

const movedRobots = input.map(robot => moveRobot(robot, 100, window))
console.log(countQuadrants(movedRobots, window)) // p1

let seconds = 0;
let robots = [...input]
while (true) {
  const robotMap = new Map(robots.map(robot => [robot.p.toString(), "#"]))
  const numRobotsWithFriends = robots.filter(robot => {
    return robot.p.adj8().some(p => robotMap.has(p.toString()))
  }).length
  if (numRobotsWithFriends > 2 * robots.length / 3) {
    // uncomment for printing tree
    // InputUtils.printPoint2DMap(robotMap)
    console.log(seconds) // p2
    break
  }
  seconds++
  robots = robots.map(robot => moveRobot(robot, 1, window))
}
