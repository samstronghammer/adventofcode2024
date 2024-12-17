
import * as fs from "fs";
import { Point2D } from "./Point2D.js";

export class InputUtils {
  static toStringArray = (directory) => {
    return fs.readFileSync(`${directory}/in.txt`, "utf-8").trim().split("\n");
  }

  static toIntArrays = (directory) => {
    return this.toStringArray(directory).map(line => {
      return [...line.matchAll(/-?\d+/g)].map(match => parseInt(match[0]))
    })
  }

  static toBigIntArrays = (directory) => {
    return this.toStringArray(directory).map(line => {
      return [...line.matchAll(/-?\d+/g)].map(match => BigInt(match[0]))
    })
  }

  static toPoint2DMap = (directory) => {
    return this.arrayToPoint2DMap(this.toStringArray(directory))
  }

  static arrayToPoint2DMap = (array) => {
    return new Map(array.flatMap((line, row) => {
      return line.split("").map((char, col) => {
        return [new Point2D(row, col).toString(), char]
      })
    }))
  }

  static printPoint2DMap = (map) => {
    const lines = process.stdout.getWindowSize()[1];
    for (let i = 0; i < lines; i++) {
      console.log('\r\n');
    }
    let maxRow = 0
    const entries = [...map.entries()]
    entries.forEach(([key, value]) => {
      const point = Point2D.fromString(key)
      process.stdout.cursorTo(point.c, point.r)
      process.stdout.write(value)
      maxRow = Math.max(maxRow, point.r)
    })
    process.stdout.cursorTo(0, maxRow + 1)
  }
}
