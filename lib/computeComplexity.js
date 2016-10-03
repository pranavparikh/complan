const Path = require('path');
const Promise = require('bluebird');
const Exec = require('child_process').exec;

module.exports = function computeComplexity (path) {
    var jsonPath = Path.join(process.cwd(), 'cc.json');
    var crPath = Path.resolve(process.execPath, '../..', 'lib/node_modules/complan/node_modules/.bin/cr');
    var cmd = crPath + ' -l -w -f json -e -x node_modules -o ' + jsonPath +  ' ' + path.join(' ');
    return new Promise(function (resolve, reject) {
        Exec(cmd , function (err, stdout,stderr) {
            if (err instanceof Error) {
                reject(err);
            }
            console.log('Successfully wrote cc.json');
            resolve(jsonPath);
        });
    });
}