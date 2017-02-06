var expect = require('chai').expect;
var request = require('./test').request;

const INVALID_USER = 'qweee';
const INVALID_PASS = 'securepasseee ';
const VALID_USER = 'qwe';
const VALID_PASS = 'securepass';

let token;

describe('Token', function () {

  it('post should return error 500 if no right creds', done => {
    request
      .post('/token')
      .type('json')
      .send({ "username": INVALID_USER, "password": INVALID_PASS })
      .expect(500, done);
  });

  it('post should return 200 if ok', done => {
    request
      .post('/token')
      .type('json')
      .send({ "username": VALID_USER, "password": VALID_PASS })
      .expect(200)
      .end((err, res) => {
        token = JSON.parse(res.text);
        done();
      });
  });

  it('get should return error 404 if wrong token', done => {
    request
      .get(`/sessions/xxxxxxxxx`)
      .expect(404, done);
  });

  it('get should return 200 if ok', done => {
    request
      .get(`/sessions/${token}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body.token)
        done(err);
      });
  });

});
