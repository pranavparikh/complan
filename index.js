#!/usr/bin/env node
'use strict'
const { Command } = require('commander')
const Debug = require('debug')('Index')

const clone = require('./lib/clone')
const getJsFiles = require('./lib/getJsFiles')
const computeComplexity = require('./lib/computeComplexity')
const generateReport = require('./lib/generateReport')
const util = require('./lib/util')
const version = require('./package.json').version

const program = new Command()

program
  .version(version)
  .usage('-g <giturl> -c <gitcheckout>')
  .option('-g, --gitUrl [url]', 'Git Url of the project you want complexity report for')
  .option('-c, --gitCheckout [branch/tag/checkout]', 'Branch / tag / checkout of the git project')

program.parseAsync(process.argv)
  .then(function () {
    const options = program.opts()

    if (!options.gitUrl) {
      console.log('Missing git Url. Git url is mandatory')
      process.exit(1)
    }

    const gitUrl = options.gitUrl
    const gitCheckout = options.gitCheckout || 'main'
    const clonedRepoPath = util.getClonedRepoPath(gitUrl, gitCheckout)
    const reportsPath = util.getReportsPath(gitUrl, gitCheckout)
    const cloneOptions = {
      checkout: gitCheckout
    }

    return clone(gitUrl, clonedRepoPath, cloneOptions)
      .then(function () {
        Debug('Cloned Repo Path:' + clonedRepoPath)
        return getJsFiles(clonedRepoPath)
      })
      .then(function (jsfiles) {
        Debug('Computing complexity')
        return computeComplexity(jsfiles, reportsPath)
      })
      .then(function (path) {
        Debug('Generating reports')
        generateReport(path, reportsPath, gitUrl)
      })
      .catch(function (err) {
        if (err) {
          console.log(err)
        }
      })
      .finally(function () {
        Debug('Cleaning up repos')
        util.cleanupClonedRepos()
      })
  })
  .catch(function (err) {
    if (err) {
      console.log(err)
    }
  })
