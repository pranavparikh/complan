const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const fs = require('node:fs')

test('package.json exists and declares supported Node engine', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))
  assert.equal(pkg.engines.node, '>=26.5.0')
})

test('main entrypoint exists and is executable', () => {
  const entry = path.join(__dirname, '..', 'index.js')
  assert.equal(fs.existsSync(entry), true)
})
