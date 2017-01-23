var fs = require('fs');
var path = require('path');
var config = require('config');
var log = require('../log');
var Zip = require('zip-archiver').Zip;

function sendFilesToClient() {
  return function (req, res, next) {
    let rootPath = path.resolve(__dirname, '../');
    let zipFilePath = path.join(rootPath, 'files.zip');
    let zip = new Zip({file: 'files.zip', root: rootPath});

    zip.add(config.uploadDestination, ()=>{
      zip.done();
      res.sendFile(zipFilePath, err=>{
        if (err) {
          res.status(err.status).end();
        }
        else {
          log.verbose('Files sent to client');
          fs.unlink(zipFilePath);
        }
      });
    });
    return next();
  }
};

module.exports = {
  sendFiles: sendFilesToClient
};
