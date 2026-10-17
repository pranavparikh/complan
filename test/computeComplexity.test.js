const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const computeComplexity = require('../lib/computeComplexity')

test('computeComplexity names the files that are missing from the report', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'complan-'))
  const reportsPath = path.join(root, 'reports')
  const es5File = path.join(root, 'es5.js')
  const modernFile = path.join(root, 'modern.js')
  fs.mkdirSync(reportsPath)
  fs.writeFileSync(es5File, 'function add (a, b) {\n  if (a > b) { return a }\n  return b\n}\n')
  fs.writeFileSync(modernFile, 'const add = (a, b) => a + b\n')

  const logged = []
  const log = console.log
  console.log = message => logged.push(String(message))

  let jsonPath
  try {
    jsonPath = await computeComplexity([es5File, modernFile], reportsPath)
  } finally {
    console.log = log
  }

  try {
    const output = logged.join('\n')
    assert.match(output, /1 of 2 files could not be parsed and are missing from the report:/)
    assert.match(output, /modern\.js/)
    assert.doesNotMatch(output, /es5\.js/)

    const written = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    assert.equal(written.reports.length, 1)
    assert.equal(written.reports[0].path, es5File)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('computeComplexity does not fail on a stale or corrupt cc.json', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'complan-'))
  const reportsPath = path.join(root, 'reports')
  fs.mkdirSync(reportsPath)
  fs.writeFileSync(path.join(reportsPath, 'cc.json'), 'not json')

  try {
    const jsonPath = await computeComplexity([], reportsPath)
    assert.equal(jsonPath, path.join(reportsPath, 'cc.json'))
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
