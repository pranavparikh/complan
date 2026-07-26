'use strict'
const Debug = require('debug')('getJsFiles')
const Fs = require('node:fs')
const Path = require('node:path')

function walk (rootPath) {
  return Fs.promises.readdir(rootPath, { withFileTypes: true }).then(function (entries) {
    return Promise.all(entries.map(function (entry) {
      const entryPath = Path.join(rootPath, entry.name)
      if (entry.name.startsWith('.')) {
        return []
      }
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules') {
          return []
        }
        return walk(entryPath)
      }
      return [entryPath]
    }))
  }).then(function (results) {
    return results.flat()
  })
}

module.exports = function getJsFiles (path) {
  return walk(path).then(function (files) {
    const jsFiles = files.filter(function (file) {
      return file.endsWith('.js')
    })
    Debug(jsFiles.length + ' files found')
    return jsFiles
  })
}
