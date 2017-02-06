const expect = require('chai').expect;
const co = require('co');
const tokenCtrl = require('../../controllers/token');

const INVALID_USER = 'qweee';
const INVALID_PASS = 'securepasseee ';
const VALID_USER = 'qwe';
const VALID_PASS = 'securepass';

let token;

describe('Token controller', function() {

  it('login should give error on wrong creds', done => {
    co(tokenCtrl.login(INVALID_USER, INVALID_PASS))
      .then(() => done(new Error("exception was expected")))
      .catch( err => {
        //console.log('err = ', err);
        done();
      });
  });


  it('login return token on correcr creds', done => {
    co(tokenCtrl.login(VALID_USER, VALID_PASS))
      .then((res) => {
        token = res;
        expect(res.length).to.equal(36);
        done();
      })
      .catch( err => {
        done(err);
      });
  });

  it('check returns null on unknown token', done => {
    co(tokenCtrl.check('xxxxxxxxx'))
      .then((res) => {
        expect(res).to.equal(null);
        done();
      })
      .catch( err => {
        done(err);
      });
  });

  it('check returns user on existing token', done => {
    co(tokenCtrl.check(token))
      .then((res) => {
        expect(res).to.equal(VALID_USER);
        done();
      })
      .catch( err => {
        done(err);
      });
  });

});
