#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toStringArray(__dirname)
const values = new Map()
const equations = []
input.forEach(s => {
  if (!s) return
  const toks = s.split(" ")
  if (toks.length === 2) {
    values.set(toks[0].substring(0, toks[0].length - 1), toks[1] === "1")
  } else if (toks.length === 5) {
    equations.push([toks[0], toks[1], toks[2], toks[4]])
  } else {
    throw new Error(`Bad line '${s}'`)
  }
})

const doOp = (in1, in2, op) => {
  switch (op) {
    case "AND":
      return in1 && in2
    case "OR":
      return in1 || in2
    case "XOR":
      return in1 !== in2
    default:
      throw new Error(`Bad op '${op}'`)
  }
}

let remainingEquations = [...equations]
while (remainingEquations.length > 0) {
  const notUsed = []
  remainingEquations.forEach((eqn) => {
    const [in1, op, in2, out] = eqn
    if (values.has(in1) && values.has(in2)) {
      values.set(out, doOp(values.get(in1), values.get(in2), op))
    } else {
      notUsed.push(eqn)
    }
  })
  remainingEquations = notUsed
}

const pad = (s, len) => {
  if (s.length >= len) return s
  return `${"0".repeat(len - s.length)}${s}`
}

let n = 0
let bits = ""
while (true) {
  const key = `z${pad(n.toString(), 2)}`
  if (!values.has(key)) break
  bits = (values.get(key) ? "1" : "0") + bits
  n++
}

console.log(parseInt(bits, 2))

const eqnToKey = (in1, in2, op) => {
  return [in1, in2, op].sort().join("-")
}

// Built this up over multiple runs
const swaps = new Map([
  ["z05", "dkr"],
  ["dkr", "z05"],
  ["z15", "htp"],
  ["htp", "z15"],
  ["z20", "hhh"],
  ["hhh", "z20"],
  ["ggk", "rhv"],
  ["rhv", "ggk"],
])
console.log(swaps)

const eqnMap = new Map()
equations.forEach((eqn) => {
  const [in1, op, in2, out] = eqn
  const key = eqnToKey(in1, in2, op)
  if (eqnMap.has(key)) throw new Error(key)
  eqnMap.set(key, [in1, op, in2, swaps.get(out) ?? out])
})

let cin = eqnMap.get(eqnToKey("x00", "y00", "AND"))[3]
for (let i = 1; i < 45; i++) {
  console.log(i)
  const x = `x${pad(i.toString(), 2)}`
  const y = `y${pad(i.toString(), 2)}`
  const z = `z${pad(i.toString(), 2)}`
  const gate1 = eqnToKey(x, y, "XOR")
  console.log("1: ", gate1)
  const gate1Out = eqnMap.get(gate1)[3]
  console.log(gate1Out)
  if (gate1Out.startsWith("z")) {
    console.log(gate1Out, "shouldn't start with z")
  }
  const gate2 = eqnToKey(gate1Out, cin, "XOR")
  console.log("2: ", gate2)
  const gate2Out = eqnMap.get(gate2)[3]
  console.log(gate2Out)
  if (!gate2Out === z) {
    console.log(gate2Out, "should be", z)
  }
  const gate3 = eqnToKey(cin, gate1Out, "AND")
  console.log("3: ", gate3)
  const gate3Out = eqnMap.get(gate3)[3]
  console.log(gate3Out)
  if (gate3Out.startsWith("z")) {
    console.log(gate3Out, "shouldn't start with z")
  }
  const gate4 = eqnToKey(x, y, "AND")
  console.log("4: ", gate4)
  const gate4Out = eqnMap.get(gate4)[3]
  console.log(gate4Out)
  if (gate4Out.startsWith("z")) {
    console.log(gate4Out, "shouldn't start with z")
  }
  const gate5 = eqnToKey(gate3Out, gate4Out, "OR")
  console.log("5: ", gate5)
  const gate5Out = eqnMap.get(gate5)[3]
  console.log(gate5Out)
  cin = gate5Out;
}

console.log([...swaps.keys()].sort().join(","))
