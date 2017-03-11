'use strict';

const
  jwt = require('jsonwebtoken'),
  createError = require('http-errors'),
  debug = require('debug')('cfgram:bearer-auth-middleware'),

  User = require('../model/user.js');

module.exports = function(req, res, next){
  debug('bearer-auth-middleware');

  var authHeader = req.headers.authorization;
  if(!authHeader){
    return next(createError(401, 'authorization Header is required'));
  }

  var token = authHeader.split('Bearer ')[1];
  if(!token){
    return next(createError(401, 'Token is required'));
  }

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if(err) return next(err);

    User.findOne({findHash: decoded.token})
    .then( user => {
      console.log('bearer ', user);
      req.user = user;
      next();
    })
    .catch(err => next(createError(401, err.message)));
  });
};