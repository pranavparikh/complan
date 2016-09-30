const gitClone = require('git-clone');
const Promise = require('bluebird');

module.exports = function clone(gitUrl, path) {
    return new Promise(function (resolve, reject) {
        gitClone(gitUrl, path, {}, function (err, result) {
            if (err) {
                console.log('Error in cloning ' + gitUrl);
                reject(err);
            } else {
                if (!result) {
                    console.log('Successfully cloned ' + gitUrl);
                    resolve('Cloned successfully..' + gitUrl)
                } else {
                    console.log(result);
                    resolve(result);
                }
            }
        });
    });
}
