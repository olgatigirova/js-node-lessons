const router = require('express').Router();
const wrap = require('co-express');
const log = require('../log');
const tokenCtrl = require('../controllers/token');

router.post('/token', wrap(function *(req, res) {
  log.info('Token generate request', req.body);
  const token = yield tokenCtrl.login(req.body.username, req.body.password);
  res.status(200).json(token);
}));

router.get('/sessions/:token', wrap(function *(req, res) {
  log.info('Token check request', req.params.token);
  const ret = yield tokenCtrl.check(req.params.token);
  if (ret) {
    res.status(200).end();
  }
  else {
    res.status(404).end();
  }
}));

module.exports = router;
