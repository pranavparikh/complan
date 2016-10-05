const Debug = require('debug')('util')
const Fse = require('fs-extra')
const GitUrlParse = require('git-url-parse')
const Path = require('path')

module.exports = {
  getClonedRepoPath: function (gitUrl) {
    return Path.join(process.cwd(), 'clonedrepos', GitUrlParse(gitUrl).pathname)
  },

  getReportsPath: function (gitUrl) {
    const reportsPath = Path.join(process.cwd(), 'reports', GitUrlParse(gitUrl).pathname)
    Fse.ensureDirSync(reportsPath)
    return reportsPath
  },

  cleanupClonedRepos: function () {
    try {
      var path = Path.join(process.cwd(), 'clonedrepos')
      Debug('Removing:' + path)
      Fse.removeSync(path)
    } catch (e) {
      console.error('Error in deleting ' + path)
      console.error(e)
    }
  }
}
