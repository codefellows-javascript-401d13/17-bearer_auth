'use strict';

const
  debug = require('debug')('cfgram:basic-auth-middleware'),
  createError = require('http-errors');

module.exports = function(req, res, next){
  debug('basic-auth-middleware');

  var authHeader = req.headers.authorization;
  if(!authHeader){
    return next(createError(401, 'Authorization Header required'));
  }

  var base16str = authHeader.split('Basic ')[1];
  if(!base16str){
    return next(createError(401, 'username and password required'));
  }

  var utf8str = new Buffer(base16str, 'base64').toString();
  var authArr = utf8str.split(':');

  req.auth = {
    username : authArr[0],
    password : authArr[1]
  };

  if(!req.auth.username){
    return next(createError(401, 'Username required'));
  }

  if(!req.auth.password){
    return next(createError(401, 'Password required'));
  }

  next();

};