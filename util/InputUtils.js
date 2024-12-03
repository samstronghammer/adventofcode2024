
import * as fs from "fs";

export class InputUtils {
  static toStringArray = (directory) => {
    return fs.readFileSync(`${directory}/in.txt`, "utf-8").trim().split("\n");
  }

  static toIntArrays = (directory) => {
    return this.toStringArray(directory).map(line => {
      return [...line.matchAll(/\d+/g)].map(match => parseInt(match[0]))
    })
  }

}

