let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));
let path = require('path');
let agent = require('superagent');
//var progressBar = require('progress-bar');

let CLOUD_URL = 'localhost:3000/upload';

module.exports = {
  upload: postFileToCloud
};

function postFileToCloud(filePath, username, password) {
  return fs.statAsync(filePath)
    .then(stats => {
//      console.log('Trying to sync file', filePath, 'with size', stats.size);
      //var bar = progressBar.create(process.stdout);
      var fileStream = fs.createReadStream(filePath);
      var uploadUrl = generateUploadUrl(filePath);
      return agent
        .post(uploadUrl)
        .auth(username, password)
        .type('form')
        //.on('progress', function(e) {
          //var percentDone = Math.floor((e.loaded / e.total) * 100);
          //bar.update(percentDone);
        //})
        .attach('syncfile', fileStream)
        .set('Accept', 'application/json');
    });
}

function generateUploadUrl(filePath) {
  const filePathQuery = encodeURI(path.resolve(filePath));
  console.log('filePathQuery generated', filePathQuery);
  return `${CLOUD_URL}?filePath=${filePathQuery}`;
}
