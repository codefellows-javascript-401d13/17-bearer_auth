'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

const exampleGallery = {
  name: 'test gallery',
  desc: 'test gallery description'
};

mongoose.Promise = Promise;

describe('GALLERY ROUTE MODEL --', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({})
    ])
    .then( () => done())
    .catch(done)
  });

  describe('for POST method in GALLERY -', () => {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    it('happy times for returned gallery.', done => {
      request.post(`${url}/api/gallery`)
      .send(exampleGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleGallery.name);
        expect(res.body.desc).to.equal(exampleGallery.desc);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
  });

  describe('for GET method in GALLERY -', () => {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    before( done => {
      exampleGallery.userID = this.tempUser._id.toString();
      new Gallery(exampleGallery).save()
      .then( gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(done);
    });

    after( () => {
      delete exampleGallery.userID;
    });

    it('happiness for successfully returned gallery.', done => {
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleGallery.name);
        expect(res.body.desc).to.equal(exampleGallery.desc);
        expect(res.body.userID).to.equal(this.tempUser._id.toString())
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
  });

  describe('for PUT method of GALLERY -', () => {
  let updatedGallery = {
    name: 'mrwhiskers',
    desc: 'one suave feline',
  };

  beforeEach( done => {
    exampleGallery.userID = this.tempUser._id.toString();
    new Gallery(exampleGallery).save()
    .then( gallery => {
      this.tempGallery = gallery;
      done();
    })
    .catch(done);
  });

  afterEach( () => delete exampleGallery.userID);

  describe('should return a passing test for:', () => {
    it('successfully updated gallery.', done => {
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
      .send(updatedGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end( (err,res) => {
        if (err) done(err);
        let date = new Date(res.body.created).toString();

        expect(res.status).to.equal(200);
        expect(res.body._id.toString()).to.equal(this.tempGallery._id.toString());
        expect(res.body.name).to.equal(updatedGallery.name);
        expect(res.body.desc).to.equal(updatedGallery.desc);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
  });

  describe('for DELETE method in GALLERY -', () => {
   beforeEach( done => {
     exampleGallery.userID = this.tempUser._id.toString();
     new Gallery(exampleGallery).save()
     .then( gallery => {
       this.tempGallery = gallery;
       done();
     })
     .catch(done);
   });

   afterEach( () => delete exampleGallery.userID);

   describe('should return passing test for:', () => {
     it('successfully processed request, but no returned content.', done => {
       request.delete(`${url}/api/gallery/${this.tempGallery._id}`)
       .set({
         Authorization: `Bearer ${this.tempToken}`,
       })
       .end( (err,res) => {
         if (err) done(err);
         expect(res.status).to.equal(204);
         done();
       });
     });
   });
});
