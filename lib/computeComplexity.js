'use strict'
const Debug = require('debug')('computeComplexity')
const Path = require('path')
const Promise = require('bluebird')
const Exec = require('child_process').exec

module.exports = function computeComplexity (paths, reportsPath) {
  reportsPath = reportsPath || process.cwd
  const jsonPath = Path.join(reportsPath, 'cc.json')
  const crPath = Path.resolve(process.execPath, '../..', 'lib/node_modules/complan/node_modules/.bin/cr')
  const cmd = crPath + ' -l -w -f json -e -x node_modules -o ' + jsonPath + ' ' + paths.join(' ')
  return new Promise(function (resolve, reject) {
    Exec(cmd, function (err, stdout, stderr) {
      if (err instanceof Error) {
        reject(err)
      }
      Debug('Successfully wrote ' + jsonPath)
      resolve(jsonPath)
    })
  })
}
