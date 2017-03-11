'use strict';

const
  mongoose = require('mongoose'),
  crypto = require('crypto'),
  debug = require('debug')('cfgram:user'),
  createError = require('http-errors'),
  Promise = require('bluebird'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),



  userSchema = mongoose.Schema({
    username : {type: String, required: true, unique: true},
    email: {type: String, required : true, unique: true},
    password: {type: String, required: true },
    findHash: {type: String, unique: true }
  });

userSchema.methods.genPasswordHash = function(password){
  debug('genPasswordHash');
  console.log('genFindhash');
  return new Promise((resolve, reject) => {
    console.log('inside Promise');
    bcrypt.hash(password, 10, (err, hash) => {
      if(err) return reject(err);
      this.password = hash;
      resolve(this);
    });
    console.log('bycrypt finished');
  });
};

userSchema.methods.compPasswordHash = function(password){
  debug('compPasswordHash');

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err);
      if(!valid) return reject(createError(401, 'wrong password'));
      resolve(this);
    });
  });
};

userSchema.methods.genFindhash = function(){
  debug('genFindhash');

  return new Promise((resolve, reject) => {
    let tries = 0;

    _genFindHash.call(this);

    function _genFindHash(){
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then( () => resolve(this.findHash))
      .catch(err => {
        if(tries > 3) return reject(err);
        tries++;
        _genFindHash.call(this);
      });
    }
  });
};

userSchema.methods.genToken = function(){
  debug('genToken');

  return new Promise((resolve, reject) => {
    this.genFindhash()
    .then(findHash => resolve(jwt.sign({token : findHash}, process.env.APP_SECRET)))
    .catch(err => reject(err));
  });
};


module.exports = mongoose.model('user', userSchema);