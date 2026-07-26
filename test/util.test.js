const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const fs = require('node:fs')
const util = require('../lib/util')

test('getClonedRepoPath uses the repository pathname', () => {
  const result = util.getClonedRepoPath('https://github.com/pranavparikh/complan.git')
  assert.match(result, /clonedrepos\/pranavparikh\/complan\.git$/)
})

test('getGitPath builds a GitHub blob URL with the repo path', () => {
  const result = util.getGitPath('https://github.com/pranavparikh/complan.git', '/tmp/clonedrepos/pranavparikh/complan/lib/index.js')
  assert.match(result, /https:\/\/github\.com\/pranavparikh\/complan\/blob\/main\/tmp\/clonedrepos\/pranavparikh\/complan\/lib\/index\.js$/)
})

test('sort orders items by the requested key', () => {
  const items = [{ name: 'beta' }, { name: 'alpha' }, { name: 'gamma' }]
  const sorted = util.sort(items, 'name')
  assert.deepEqual(sorted.map(item => item.name), ['alpha', 'beta', 'gamma'])
})

test('getReportsPath creates the expected report directory', () => {
  const reportsPath = util.getReportsPath('https://github.com/pranavparikh/complan.git', 'main')
  assert.match(reportsPath, /reports\/pranavparikh\/complan\.git\/main$/)
  assert.equal(fs.existsSync(reportsPath), true)
})

test('cleanupClonedRepos removes the cloned repos directory', () => {
  const cloneDir = path.join(process.cwd(), 'clonedrepos')
  fs.mkdirSync(cloneDir, { recursive: true })
  fs.writeFileSync(path.join(cloneDir, 'placeholder.txt'), 'test')

  util.cleanupClonedRepos()

  assert.equal(fs.existsSync(cloneDir), false)
})
