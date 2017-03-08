'use strict';

const
  Router = require('express').Router,
  debug = require('debug')('cfgram:auth-router'),
  jsonParser = require('body-parser').json(),
  basicAuth = require('../lib/basic-auth-middleware.js'),

  User = require('../model/user.js'),

  authRouter = module.exports = Router();

authRouter.post('/api/signup', jsonParser, function(req, res, next){
  debug('post /api/signup');

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);
  user.genPasswordHash(password)
  .then( user => user.save())
  .then( user => user.genToken())
  .then( token => res.send(token))
  .catch(next);
});

authRouter.get('/api/signin', basicAuth, function(req, res, next){
  debug('get /api/signin');

  User.findOne({username: req.auth.username})
  .then( user => user.compPasswordHash(req.auth.password))
  .then( user => user.genToken())
  .then( token => res.send(token))
  .catch(next);
});