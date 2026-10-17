const test = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

test('CLI exits with an error when git URL is missing', () => {
  const result = spawnSync(process.execPath, [path.join(__dirname, '..', 'index.js')], {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  })

  assert.notEqual(result.status, 0)
  assert.match(result.stdout + result.stderr, /Missing git Url/)
})

test('CLI exits with an error when the git URL cannot be used', () => {
  const result = spawnSync(process.execPath, [path.join(__dirname, '..', 'index.js'), '-g', 'not-a-real-repo'], {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  })

  assert.notEqual(result.status, 0)
  assert.match(result.stdout + result.stderr, /URL parsing failed/)
})
