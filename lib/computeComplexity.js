'use strict'
const Debug = require('debug')('computeComplexity')
const Path = require('path')
const { execFile } = require('node:child_process')
const { promisify } = require('node:util')

const execFileAsync = promisify(execFile)

module.exports = function computeComplexity (paths, reportsPath) {
  reportsPath = reportsPath || process.cwd()
  const jsonPath = Path.join(reportsPath, 'cc.json')
  const crPath = require.resolve('complexity-report/src/index.js')
  const args = ['-l', '-w', '-f', 'json', '-e', '-x', 'node_modules', '-o', jsonPath].concat(paths)
  return execFileAsync(process.execPath, [crPath].concat(args), { stdio: 'pipe' })
    .then(function () {
      Debug('Successfully wrote ' + jsonPath)
      return jsonPath
    })
}
