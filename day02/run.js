#!/usr/bin/node
import path from 'path';
import { InputUtils } from "../util/InputUtils.js"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = InputUtils.toIntArrays(__dirname)

const isReportSafe = (report) => {
    const deltas = []
    for (let i = 1; i < report.length; i++) {
        deltas.push(report[i] - report[i - 1])
    }
    if (!deltas.every(delta => delta < 0 && delta > -4) 
        && !deltas.every(delta => delta > 0 && delta < 4)) return false
    return true
}

const safeReports = data.filter(isReportSafe)

const kindaSafeReports = data.filter(report => {
    if (isReportSafe(report)) return true
    for (let i = 0; i < report.length; i++) {
        if (isReportSafe(report.toSpliced(i, 1))) return true
    }
    return false
})

console.log(safeReports.length)
console.log(kindaSafeReports.length)
