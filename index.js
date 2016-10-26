#!/usr/bin/env node
'use strict'
const Program = require('commander')

const clone = require('./lib/clone')
const getJsFiles = require('./lib/getJsFiles')
const computeComplexity = require('./lib/computeComplexity')
const generateReport = require('./lib/generateReport')
const util = require('./lib/util')
const version = require('./package.json').version

Program
    .version(version)
    .usage('-g <giturl> -c <gitcheckout>')
    .option('-g, --gitUrl [url]', 'Git Url of the project you want complexity report for')
    .option('-c, --gitCheckout [branch/tag/checkout]', 'Branch / tag / checkout of the git project')
    .parse(process.argv)

if (!Program.gitUrl) {
  console.log('Missing git Url. Git url is mandatory')
  process.exit(1)
}

const gitUrl = Program.gitUrl
const gitCheckout = Program.gitCheckout || 'master'
const clonedRepoPath = util.getClonedRepoPath(gitUrl, gitCheckout)
const reportsPath = util.getReportsPath(gitUrl, gitCheckout)
const cloneOptions = {
  checkout: gitCheckout
}
clone(gitUrl, clonedRepoPath, cloneOptions).then(function () {
  return getJsFiles(clonedRepoPath)
}).then(function (jsfiles) {
  return computeComplexity(jsfiles, reportsPath)
}).then(function (path) {
  generateReport(path, reportsPath, gitUrl)
}).catch(function (err) {
  if (err) {
    console.log(err)
  }
}).finally(function () {
  util.cleanupClonedRepos()
})
