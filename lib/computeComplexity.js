const Path = require('path')
const Promise = require('bluebird')
const Exec = require('child_process').exec

module.exports = function computeComplexity (paths, reportsPath) {
  var jsonPath = Path.join(process.cwd(), 'cc.json')
  var jsonReportPath = Path.join(reportsPath, 'complexity-report.json')
  var crPath = Path.resolve(process.execPath, '../..', 'lib/node_modules/complan/node_modules/.bin/cr')
  var cmd = crPath + ' -l -w -f json -e -x node_modules -o ' + jsonReportPath + ' ' + paths.join(' ')
  return new Promise(function (resolve, reject) {
    Exec(cmd, function (err, stdout, stderr) {
      if (err instanceof Error) {
        reject(err)
      }
      console.log('Successfully wrote ' + jsonReportPath)
      resolve(jsonPath)
    })
  })
}
