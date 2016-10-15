#!/usr/bin/env node
'use strict'
const Debug = require('debug')('main')
const Program = require('commander')

const clone = require('./lib/clone')
const getJsFiles = require('./lib/getJsFiles')
const computeComplexity = require('./lib/computeComplexity')
const generateReport = require('./lib/generateReport')
const util = require('./lib/util')
const version = require('./package.json').version

Program
    .version(version)
    .usage('-g <giturl>')
    .option('-g, --gitUrl [url]', 'Git Url of the project you want complexity report for')
    .parse(process.argv)

if (!Program.gitUrl) {
  console.log('Missing git Url. Git url is mandatory')
  process.exit(1)
}

const gitUrl = Program.gitUrl
const clonedRepoPath = util.getClonedRepoPath(gitUrl)
const reportsPath = util.getReportsPath(gitUrl)

clone(gitUrl, clonedRepoPath).then(function () {
  return getJsFiles(clonedRepoPath)
}).then(function (jsfiles) {
  return computeComplexity(jsfiles, reportsPath)
}).then(function (path) {
  let complexityReport = generateReport(path, reportsPath, gitUrl)
  Debug(JSON.stringify(complexityReport, null, 3))
}).catch(function (err) {
  if (err) {
    console.log(err)
  }
}).finally(function () {
  util.cleanupClonedRepos()
})
