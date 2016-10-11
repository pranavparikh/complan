'use strict'
const Fse = require('fs-extra')
const Path = require('path')

module.exports = function (path, reportsPath) {
  var complexityReport = {}
  complexityReport.report = []
  const jsonReport = JSON.parse(Fse.readFileSync(path, 'utf-8'))
  jsonReport.reports.forEach(function (report) {
    var rep = {}
    rep.path = report.path
    rep.cyclomatic = report.cyclomatic
    rep.loc = report.loc
    rep.maintainability = report.maintainability
    complexityReport.report.push(rep)
  })
  complexityReport.cyclomatic = jsonReport.cyclomatic
  complexityReport.loc = jsonReport.loc
  complexityReport.maintainability = jsonReport.maintainability
  Fse.writeFileSync(Path.join(reportsPath, 'complexity-report.json'), JSON.stringify(complexityReport, null, 3))
  Fse.removeSync(Path.join(process.cwd(), 'cc.json'))
  return complexityReport
}
