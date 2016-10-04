const Dir = require('node-dir')
const Promise = require('bluebird')

module.exports = function getJsFiles (path) {
  return new Promise(function (resolve, reject) {
    Dir.readFiles(path, {
      match: /.js$/,
      exclude: /^\./,
      excludeDir: /node_modules/
    }, function (err, content, next) {
      if (err) {
        return reject(err)
      }
      next()
    },
     function (err, files) {
       if (err) {
         return reject(err)
       }
       console.log(files.length + ' files found')
       resolve(files)
     })
  })
}
