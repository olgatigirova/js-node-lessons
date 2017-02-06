const multer = require('multer');
const co = require('co');
const config = require('config');
const log = require('../log');
const filesList = require('./filelist');

const uploadMiddleware = multer({
  dest: config.uploadDestination,
  fileFilter: fileFilter
});

function fileFilter(req, file, cb) {
  const filePath = req.query.filePath;
  co(filesList.filePathFilter(filePath))
  .then ( res => {
      cb(null, res);
  })
  .catch( err => {
    cb(err, true);
  });
}

function validateRequest() {
  return function(req, res, next) {
    var filePath = req.query.filePath;
    if (!filePath) {
      var err = new Error('Validation error: filePath parameter is missing', 400);
      return next(err);
    }
    next();
  };
}

module.exports = {
  parse: uploadMiddleware,
  validate: validateRequest
};
