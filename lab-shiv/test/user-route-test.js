'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

mongoose.Promise = Promise;

rewquire('../server.js');

const url = `localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser';
  password: '1234',
  email: 'exampleuser@test.com'
};

describe('USER ROUTE MODULE --', function() {
  describe('For POST routes -', function() {
    describe('should return passing tests for:', function() {
      after( done => {
        user.remove({})
        .then( () => done())
        .catch(done);
      });

      it('a successful new user signup.', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser);
        .end((err, res) => {
          if(err) return done(err);;
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
  });

  describe('For GET routes -', function() {
    describe('should return passing tests for:', function() {
      before( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });

      after( done => {
        user.remove({})
        .then( () => done())
        .catch(done);
      });

      it('successfully receiving a token.', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleuser', '1234');
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.be(200);
          done();
        })
      })
    })
  })
})
