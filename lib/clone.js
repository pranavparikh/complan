'use strict'
const Debug = require('debug')('clone')
const Fse = require('fs-extra')
const Promise = require('bluebird')
const Git = require('simple-git')('./')

module.exports = function clone (gitUrl, path, options) {
  Debug('Cloning ' + gitUrl)

  try {
    Fse.emptyDirSync(path)
  } catch (e) {
    console.error('Error in emptying ' + path)
    console.error(e)
  }

  return new Promise(function (resolve, reject) {
    Git.clone(gitUrl, path, options, function (err, result) {
      if (err) {
        console.log('Error in cloning ' + gitUrl)
        reject(err)
      } else {
        if (!result) {
          Debug('Successfully cloned ' + gitUrl)
          resolve('Cloned successfully..' + gitUrl)
        } else {
          Debug(result)
          resolve(result)
        }
      }
    })
  })
}
