'use strict'
const Fse = require('fs-extra')
const Path = require('path')
const Util = require('./util')

module.exports = function (path, reportsPath, gitUrl) {
  var complexityReport = {}

  const jsonReport = JSON.parse(Fse.readFileSync(path, 'utf-8'))

  complexityReport.cyclomatic = +(jsonReport.cyclomatic.toFixed(2))
  complexityReport.loc = +(jsonReport.loc.toFixed(2))
  complexityReport.maintainability = +(jsonReport.maintainability.toFixed(2))

  complexityReport.report = []
  jsonReport.reports.forEach(function (report) {
    var rep = {}
    rep.path = Util.getGitPath(gitUrl, report.path)
    rep.cyclomatic = +(report.cyclomatic.toFixed(2))
    rep.loc = report.aggregate.sloc.physical
    rep.avglocPerMethod = +(report.loc.toFixed(2))
    rep.maintainability = +(report.maintainability.toFixed(2))
    complexityReport.report.push(rep)
  })
  Fse.writeFileSync(Path.join(reportsPath, 'complexity-report.json'), JSON.stringify(complexityReport, null, 3))
  console.log('Successfully wrote report at: ' + Path.join(reportsPath, 'complexity-report.json'))
  Fse.removeSync(Path.join(process.cwd(), 'cc.json'))
  return complexityReport
}
