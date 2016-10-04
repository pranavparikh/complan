const Fs = require('fs')

module.exports = function (path) {
  var complexityReport = {}
  complexityReport.report = []
  var jsonReport = JSON.parse(Fs.readFileSync(path, 'utf-8'))
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
  return complexityReport
}
