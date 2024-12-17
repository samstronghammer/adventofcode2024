#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
import { shallowEqualArrays } from 'shallow-equal';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toBigIntArrays(__dirname)
const inputRegisters = {
  A: input[0][0],
  B: input[1][0],
  C: input[2][0],
}
const inputInstructions = input[4]

const runProgram = (inRegisters, instructions, goalOutput) => {
  const instructionCheck = goalOutput ? [...goalOutput] : undefined
  instructionCheck?.reverse()
  const registers = { ...inRegisters }
  let ptr = 0
  const output = []
  const comboOperand = (operand) => {
    if (0n <= operand && operand < 4n) return operand
    if (operand === 4n) return registers.A
    if (operand === 5n) return registers.B
    if (operand === 6n) return registers.C
    throw new Error("invalid")
  }
  while (ptr < instructions.length) {
    const opcode = instructions[ptr]
    const operand = [1n, 3n].includes(opcode) ? instructions[ptr + 1] : comboOperand(instructions[ptr + 1])
    switch (opcode) {
      case 0n:
        registers.A >>= operand
        break
      case 1n:
        registers.B = registers.B ^ operand
        break
      case 2n:
        registers.B = operand % 8n
        break
      case 3n:
        if (registers.A !== 0n) ptr = Number(operand) - 2
        break
      case 4n:
        registers.B = registers.B ^ registers.C
        break
      case 5n:
        const newOutput = operand % 8n
        const nextInstruction = instructionCheck?.pop()
        if (instructionCheck && newOutput !== nextInstruction) return undefined
        output.push(newOutput)
        break
      case 6n:
        registers.B = registers.A >> operand
        break
      case 7n:
        registers.C = registers.A >> operand
        break
      default:
        throw new Error("invalid opcode")
    }
    ptr += 2
  }
  if (instructionCheck && instructionCheck.length > 0) return undefined
  return output
}

const findTheValue = (startValue, i) => {
  const goalOutput = inputInstructions.slice(-(i + 1))
  for (let j = 0n; j < 8n; j++) {
    const newValue = startValue + j
    const output = runProgram({ A: newValue, B: 0n, C: 0n }, inputInstructions, goalOutput)
    if (!output) continue
    if (goalOutput.length === inputInstructions.length) return newValue
    const recurseValue = findTheValue(newValue << 3n, i + 1)
    if (recurseValue !== undefined) return recurseValue
  }
  return undefined
}

const p1 = runProgram(inputRegisters, inputInstructions, undefined)
console.log(p1.join(","))
const p2 = findTheValue(0n, 0)
if (!shallowEqualArrays(inputInstructions, runProgram({ A: p2, B: 0n, C: 0n }, inputInstructions, undefined))) throw new Error("Didn't find solution")
console.log(p2.toString())
