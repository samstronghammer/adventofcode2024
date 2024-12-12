
export class Point2D {
  constructor(r, c) {
    this.r = r
    this.c = c
  }

  static fromString = (s) => {
    const regex = /\((-?\d+),(-?\d+)\)/
    const match = s.match(regex)
    if (match === null || match[0] !== s) throw new Error(`Invalid Point2D string: ${s}`)
    return new Point2D(parseInt(match[1]), parseInt(match[2]))
  }

  toString = () => {
    return `(${this.r},${this.c})`
  }

  add = (other) => {
    if (!(other instanceof Point2D)) throw new Error(`Not instance of Point2D: ${other}`)
    return new Point2D(this.r + other.r, this.c + other.c)
  }

  sub = (other) => {
    if (!(other instanceof Point2D)) throw new Error(`Not instance of Point2D: ${other}`)
    return new Point2D(this.r - other.r, this.c - other.c)
  }

  adj4 = () => {
    return ADJ_4.map(adj => this.add(adj))
  }

  adj8 = () => {
    return ADJ_8.map(adj => this.add(adj))
  }

  diag4 = () => {
    return DIAG_4.map(adj => this.add(adj))
  }

  equals = (other) => {
    if (!(other instanceof Point2D)) throw new Error(`Not instance of Point2D: ${other}`)
    return this.r === other.r && this.c === other.c
  }

  turnRight = () => {
    return new Point2D(this.c, -this.r)
  }

  turnLeft = () => {
    return new Point2D(-this.c, this.r)
  }

}

export const RIGHT = new Point2D(0, 1)
export const LEFT = new Point2D(0, -1)
export const UP = new Point2D(-1, 0)
export const DOWN = new Point2D(1, 0)
export const ADJ_4 = [UP, RIGHT, DOWN, LEFT]
export const UP_LEFT = UP.add(LEFT)
export const UP_RIGHT = UP.add(RIGHT)
export const DOWN_LEFT = DOWN.add(LEFT)
export const DOWN_RIGHT = DOWN.add(RIGHT)
export const ADJ_8 = [UP_LEFT, UP, UP_RIGHT, RIGHT, DOWN_RIGHT, DOWN, DOWN_LEFT, LEFT]
export const DIAG_4 = [UP_LEFT, UP_RIGHT, DOWN_RIGHT, DOWN_LEFT]
