'use strict';

const
  Router = require('express').Router,
  jsonParser = require('body-parser').json(),
  createError = require('http-errors'),
  debug = require('debug')('cfgram:gallery-router'),

  Gallery = require('../model/gallery.js'),
  bearerAuth = require('../lib/bearer-auth-middleware.js'),

  galleryRouter = module.exports = Router();

galleryRouter.post('/api/gallery', bearerAuth, jsonParser,  function(req, res, next){
  debug('POST /api/gallery');

  req.body.userID = req.user._id;
  new Gallery(req.body).save()
  .then( gallery => {
    console.log('gallery\n', gallery);
    return res.json(gallery);
  })
  .catch(next);
});

galleryRouter.get('/api/gallery/:id', bearerAuth, function(req, res, next){
  debug('GET /api/gallery/:id');

  Gallery.findById(req.params.id)
  .then( gallery => {
    if(gallery.userID.toString() !== req.user._id.toString()){
      return next(createError(401, 'invalid user'));
    }
    res.json(gallery);
  })
  .catch(next);
});

galleryRouter.put('/api/gallery/:id', bearerAuth, function(req, res, next){
  debug('PUT /api/gallery/:id');

  Gallery.findOneAndUpdate({userID : req.params.id}, req.body, {new : true})
  .then( gallery => res.json(gallery))
  .catch(next);
});

galleryRouter.delete('/api/gallery/:id',bearerAuth, function(req, res, next){
  debug('DELETE /api/gallery/:id');
  
  Gallery.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send('Successfuly deleted'))
  .catch(next);
});



