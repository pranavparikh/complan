'use strict'
const Fse = require('fs-extra')
const Path = require('path')
const Util = require('./util')
const Debug = require('debug')('generateReport')

module.exports = function (path, reportsPath, gitUrl) {
  const jsonReport = JSON.parse(Fse.readFileSync(path, 'utf-8'))

  generateJsonReport(jsonReport, gitUrl, reportsPath)

  generateHtmlReport(jsonReport, gitUrl, reportsPath)

  console.log('Successfully wrote JSON and HTML reports under ' + reportsPath)

  Fse.removeSync(Path.join(process.cwd(), 'cc.json'))
}

function generateJsonReport (jsonReport, gitUrl, reportsPath) {
  let complexityReport = getComplexityReport(jsonReport, gitUrl, false)
  Fse.writeFileSync(Path.join(reportsPath, 'complexity-report.json'), JSON.stringify(complexityReport, null, 3))

  Debug(JSON.stringify(complexityReport, null, 3))
}

function generateHtmlReport (jsonReport, gitUrl, reportsPath) {
  let complexityReport = getComplexityReport(jsonReport, gitUrl, true)

  let html = getHtml(complexityReport)

  Fse.writeFileSync(Path.join(reportsPath, 'complexity-report.html'), html)
}

function getHtml (complexityReport) {
  let html = '<html><body><table border=\'1\'>'
  html += '<tr bgcolor="#DCDCDC">' +
    '<th>Path</th>' +
    '<th>Cyclomatic<br> Complexity</th>' +
    '<th>Lines Of<br> Code</th>' +
    '<th>Avg LOC<br> Per Method</th>' +
    '<th>Maintainability</th></tr>'

  complexityReport.report.forEach(function (report) {
    html += '<tr bgcolor=\'#F8F8FF\'>'
    html += ('<td><a href=' + report.path + '>' + report.localPath + '</a></td>')
    html += ('<td>' + report.cyclomatic + '</td>')
    html += ('<td>' + report.loc + '</td>')
    html += ('<td>' + report.avglocPerMethod + '</td>')
    html += ('<td>' + report.maintainability + '</td>')
    html += ('<tr>')
  })
  html += '</table></body>'
  return html
}

function getComplexityReport (jsonReport, gitUrl, toDecorate) {
  let complexityReport = {}
  complexityReport.cyclomatic = +(jsonReport.cyclomatic.toFixed(2))
  complexityReport.loc = +(jsonReport.loc.toFixed(2))
  complexityReport.maintainability = +(jsonReport.maintainability.toFixed(2))

  complexityReport.report = []
  jsonReport.reports.forEach(function (report) {
    let rep = {}
    rep.path = Util.getGitPath(gitUrl, report.path)
    rep.cyclomatic = +(report.cyclomatic.toFixed(2))
    rep.loc = report.aggregate.sloc.physical
    rep.avglocPerMethod = +(report.loc.toFixed(2))
    rep.maintainability = +(report.maintainability.toFixed(2))
    if (toDecorate === true) {
      rep.localPath = Util.getFileName(gitUrl, report.path)
    }
    complexityReport.report.push(rep)
  })
  complexityReport.report = Util.sort(complexityReport.report, 'path')
  return complexityReport
}
