#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = InputUtils.toIntArrays(__dirname)
const emptyIndex = input.findIndex(list => list.length === 0)
const rules = input.filter((_, i) => i < emptyIndex)
const updates = input.filter((_, i) => i > emptyIndex)

const satisfiesRule = (update, rule) => {
  if (!update.includes(rule[0]) || !update.includes(rule[1])) return true
  return update.indexOf(rule[0]) < update.indexOf(rule[1])
}

const correctUpdates = updates.filter(update => {
  return rules.every(rule => satisfiesRule(update, rule))
})

const incorrectUpdates = updates.filter(update => {
  return !rules.every(rule => satisfiesRule(update, rule))
}).map(update => [...update].sort((n1, n2) => {
  const rule = rules.find(rule => rule.includes(n1) && rule.includes(n2))
  if (!rule) return 0
  return rule[0] === n1 ? -1 : 1
}))

const getResult = (someUpdates) => someUpdates.map(update => update[(update.length - 1) / 2])
  .reduce((acc, num) => acc + num, 0)

console.log(getResult(correctUpdates))
console.log(getResult(incorrectUpdates))
