const expect = require('chai').expect;
const validator = require('../../controllers/upload').validate();

describe('Upload controller', () => {

  it('validator middleware should validate correct request', () => {
    validator({ query: { filePath: 'path/to/file' } }, {}, err => {
      expect(err).to.equal(undefined);
    });
  });

  it('validator middleware should give validation error on request with no filePath', () => {
    validator({ query: {} }, {}, err => {
      expect(err.code).to.equal(400);
    });
  });

});
