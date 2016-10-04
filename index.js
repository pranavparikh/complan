#!/usr/bin/env node

const Program = require('commander')

const clone = require('./lib/clone')
const getJsFiles = require('./lib/getJsFiles')
const computeComplexity = require('./lib/computeComplexity')
const generateReport = require('./lib/generateReport')
const util = require('./lib/util')

Program
    .version('0.0.1')
    .usage('-g <giturl>')
    .option('-g, --gitUrl [url]', 'Git Url of the project you want complexity report for')
    .parse(process.argv)

if (!Program.gitUrl) {
  console.log('Missing git Url. Git url is mandatory')
  process.exit(1)
}

const gitUrl = Program.gitUrl
const path = util.getProjectPath(gitUrl)

clone(gitUrl, path).then(function () {
  return getJsFiles(path)
}).then(function (jsfiles) {
  return computeComplexity(jsfiles)
}).then(function (path) {
  var complexityReport = generateReport(path)
  console.log(JSON.stringify(complexityReport, null, 3))
}).catch(function (err) {
  if (err) {
    console.log(err)
  }
}).finally(function () {
  util.cleanupClonedRepos()
})
