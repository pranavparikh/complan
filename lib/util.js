'use strict'
const Debug = require('debug')('util')
const Fse = require('fs-extra')
const GitUrlParse = require('git-url-parse')
const Path = require('path')
const _ = require('lodash')

function getRepoPathName (gitUrl) {
  // Resolve the url pathname against the root so that '..' segments cannot
  // walk out of the directory it is joined to.
  return Path.join('/', GitUrlParse(gitUrl).pathname).slice(1)
}

module.exports = {
  getClonedRepoPath: function (gitUrl) {
    return Path.join(process.cwd(), 'clonedrepos', getRepoPathName(gitUrl))
  },

  getReportsPath: function (gitUrl, gitCheckout) {
    const reportsPath = Path.join(process.cwd(), 'reports', getRepoPathName(gitUrl), gitCheckout)
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
    const hash = (git.hash === '' ? 'main' : git.hash)
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
