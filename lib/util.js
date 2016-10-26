'use strict'
const Debug = require('debug')('util')
const Fse = require('fs-extra')
const GitUrlParse = require('git-url-parse')
const Path = require('path')
const _ = require('lodash')

module.exports = {
  getClonedRepoPath: function (gitUrl) {
    return Path.join(process.cwd(), 'clonedrepos', GitUrlParse(gitUrl).pathname)
  },

  getReportsPath: function (gitUrl, gitCheckout) {
    const reportsPath = Path.join(process.cwd(), 'reports', GitUrlParse(gitUrl).pathname, gitCheckout)
    Fse.ensureDirSync(reportsPath)
    return reportsPath
  },

  cleanupClonedRepos: function () {
    const path = Path.join(process.cwd(), 'clonedrepos')
    try {
      Debug('Removing:' + path)
      Fse.removeSync(path)
    } catch (e) {
      console.error('Error in deleting ' + path)
      console.error(e)
    }
  },

  getGitPath: function (gitUrl, localPath) {
    const fileName = this.getFileName(gitUrl, localPath)
    const git = GitUrlParse(gitUrl)
    const hash = (git.hash === '' ? 'master' : git.hash)
    let pathname = git.pathname
    const lastIndexOfGit = pathname.lastIndexOf('.git')
    if (lastIndexOfGit > 0) {
      pathname = pathname.slice(0, lastIndexOfGit)
    }
    return 'https://' + git.resource + pathname + '/blob/' + hash + fileName
  },

  getFileName: function (gitUrl, localPath) {
    const pathToReplace = Path.join(process.cwd(), 'clonedrepos', GitUrlParse(gitUrl).pathname)
    return localPath.replace(pathToReplace, '')
  },

  sort: function (array, key) {
    return _.sortBy(array, key)
  }
}
