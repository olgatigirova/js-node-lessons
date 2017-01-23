var multer = require('multer');
var fs = require('fs');
var path = require('path');
var config = require('config');
var log = require('../log');

var uploadMiddleware = multer({
  dest: config.uploadDestination,
  fileFilter: fileFilter,
});

var FILES_LIST_PATH = config.filesListPath;
var FILERECORDSPLITTER = config.filesRecordSplitter;
var filesList = [];

try {
  filesList = fs.readFileSync(FILES_LIST_PATH, 'utf8').split(FILERECORDSPLITTER);
  log.info('FileList loaded at start');
} catch (err) {
  log.info('No fileList found at start');
}

function fileFilter(req, file, cb) {
  if (isFileOk(req.query.filePath, req.query.fileDate)) {
    cb(null, false);
  } else {
    cb(null, true);
  }
}

function isFileOk(checkfile, checkfileDate) {
  ret = false;
  let i = filesList.findIndex(file => file.includes(checkfile));
  if (i >= 0) { //file was already recorded
    if (isFileUpToDate(filesList[i], checkfileDate)) {
      ret = true;
    } else {
      filesList.splice(i, 1); // TODO: Remove old file version from uploads and file 'fileslist'
    }
  }
  log.debug('isFileOk ' + ret + ' for ' + checkfile);
  return ret;
}

function isFileUpToDate(filesListEntry, fileDate) {
  var [name, actualPath] = filesListEntry.split(':');
  try {
    let actualDate = fs.statSync(path.join(__dirname, '../' + actualPath)).mtime;
    log.debug('fileDate = ' + fileDate + ':' + Date.parse(fileDate));
    log.debug(name + ':' + actualPath + ':date ' + actualDate + ':' + Date.parse(actualDate));
    return Date.parse(fileDate) <= Date.parse(actualDate);
  } catch (err) {
    return false;
  }
}

function validateRequest() {
  return function (req, res, next) {
    var filePath = req.query.filePath;
    if (!filePath) {
      var err = new Error('Validation error: filePath parameter is missing');
      err.code = 400;
      return next(err);
    }
    next();
  }
}

function saveToFileList(fileName, realFilePath) {
  try {
    var fileRecord = fileName + ':' + realFilePath;
    filesList.push(fileRecord);
    fs.appendFileSync(FILES_LIST_PATH, fileRecord + FILERECORDSPLITTER);
  } catch (err) {
    log.debug(err);
  }
  log.debug('File saved to list', fileName);
}

module.exports = {
  parse: uploadMiddleware,
  validate: validateRequest,
  saveFileInfo: saveToFileList,
};