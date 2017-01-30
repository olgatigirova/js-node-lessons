const path = require('path');
const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const superagent = require('superagent');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const cloud = require('../../cloudClient');

const VALID_FILE_PATH = '../README.md';
const VALID_FILE_SIZE = fs.statSync(path.resolve(VALID_FILE_PATH)).size;
const VALID_USER = 'qwe';
const VALID_PASSWORD = 'securepass';
const INVALID_FILE_PATH = '../README123.md';
const NO_FILE_ERROR_PART = 'ENOENT: no such file or directory';
const STUB_SERVER_RESPONSE = 'ok';


describe('Upload unit', function () {

  let postRequest;

  before(() => {
    postRequest = sinon.stub(superagent, 'post');
  });

  after(() => {
    postRequest.restore();
  });

  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    console.log.restore();
  });

  it('should give error if file doesnt exist', () => {
    return cloud.upload(INVALID_FILE_PATH)
      .then(result => {
        return Promise.reject('Got success result' + result);
      })
      .catch(function (err) {
        return expect(err.message.includes(NO_FILE_ERROR_PART)).to.equal(true);
      });
  });

  class PostStub {
    constructor() {
      ['auth', 'type', 'on', 'attach']
      .map(method => this[method] = () => this);
    }
    set() { return STUB_SERVER_RESPONSE };
  };
  
  it('should return result of the cloud response', () => {
    postRequest.returns(new PostStub());
    return cloud.upload(VALID_FILE_PATH, VALID_USER, VALID_PASSWORD)
      .then(function (result) {
        return Promise.all([
          expect(result).to.equal(STUB_SERVER_RESPONSE),
          expect(console.log).to.be.calledWith(
            'Trying to sync file', VALID_FILE_PATH, 'with size', VALID_FILE_SIZE
          )
        ]);
      });
  });


});