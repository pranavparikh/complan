const Fse = require('fs-extra')
const GitUrlParse = require("git-url-parse")
const Path = require('path')

module.exports = {
  getProjectPath: function (gitUrl) {
    return Path.join(process.cwd(), 'clonedrepos', GitUrlParse(gitUrl).pathname)
  },

  cleanupClonedRepos: function () {
    try {
      var path = Path.join(process.cwd(), 'clonedrepos')
      console.log('Removing:' + path)
      Fse.removeSync(path)
    } catch (e) {
      console.error('Error in deleting ' + path)
      console.error(e)
    }
  }
}
