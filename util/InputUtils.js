
import * as fs from "fs";
import { Point2D } from "./Point2D.js";

export class InputUtils {
  static toStringArray = (directory) => {
    return fs.readFileSync(`${directory}/in.txt`, "utf-8").trim().split("\n");
  }

  static toIntArrays = (directory) => {
    return this.toStringArray(directory).map(line => {
      return [...line.matchAll(/\d+/g)].map(match => parseInt(match[0]))
    })
  }

  static toPoint2DMap = (directory) => {
    return new Map(this.toStringArray(directory).flatMap((line, row) => {
      return line.split("").map((char, col) => {
        return [new Point2D(row, col).toString(), char]
      })
    }))
  }
}
