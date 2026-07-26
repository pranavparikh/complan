'use strict'
const Debug = require('debug')('clone')
const Fse = require('fs-extra')
const { execFile } = require('node:child_process')
const { promisify } = require('node:util')

const execFileAsync = promisify(execFile)

module.exports = function clone (gitUrl, path, options) {
  Debug('Cloning ' + gitUrl)

  try {
    Fse.emptyDirSync(path)
  } catch (e) {
    console.error('Error in emptying ' + path)
    console.error(e)
  }

  return execFileAsync('git', ['clone', gitUrl, path], { stdio: 'pipe' })
    .then(function () {
      const checkout = options && options.checkout
      if (!checkout || checkout === 'main') {
        Debug('Successfully cloned ' + gitUrl)
        return 'Cloned successfully..' + gitUrl
      }

      return execFileAsync('git', ['-C', path, 'checkout', checkout], { stdio: 'pipe' })
        .then(function () {
          Debug('Successfully cloned and checked out ' + checkout)
          return 'Cloned successfully..' + gitUrl
        })
    })
    .catch(function (err) {
      console.log('Error in cloning ' + gitUrl)
      throw err
    })
}
