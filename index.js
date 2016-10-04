#!/usr/bin/env node

const Fse = require('fs-extra')
const Path = require('path')
const Program = require('commander')

const clone = require('./lib/clone')
const getJsFiles = require('./lib/getJsFiles')
const computeComplexity = require('./lib/computeComplexity')
const generateReport = require('./lib/generateReport')

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
const projectName = gitUrl.substr(gitUrl.lastIndexOf('/') + 1)
const path = Path.join(process.cwd(), 'clonedrepos', projectName)

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
  try {
    Fse.removeSync(path)
  } catch (e) {
    console.error('Error in deleting ' + path)
    console.error(e)
  }
})
