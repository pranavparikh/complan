'use strict'
const Debug = require('debug')('computeComplexity')
const Fs = require('node:fs')
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
      warnAboutSkippedFiles(jsonPath, paths)
      return jsonPath
    })
}

function warnAboutSkippedFiles (jsonPath, paths) {
  if (!Fs.existsSync(jsonPath)) {
    return
  }

  const analysed = JSON.parse(Fs.readFileSync(jsonPath, 'utf-8')).reports.map(function (report) {
    return report.path
  })
  const skipped = paths.filter(function (path) {
    return analysed.indexOf(path) === -1
  })

  if (skipped.length > 0) {
    console.log(skipped.length + ' of ' + paths.length + ' files could not be parsed and are missing from the report:')
    skipped.forEach(function (path) {
      console.log('  ' + path)
    })
  }
}
