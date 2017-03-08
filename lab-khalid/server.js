'use strict';

const
  express = require('express'),

  mongoose = require('mongoose'),
  Promise = require('bluebird'),

  morgan = require('morgan'),
  cors = require('cors'),
  debug = require('debug')('cfgram:server'),
  errors = require('./lib/error-middleware.js'),
  dotenv = require('dotenv'),

  authRouter = require('./route/auth-router.js'),
  galleryRouter = require('./route/gallery-router.js');

dotenv.load();

const
  PORT = process.env.PORT,
  app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);
app.use(galleryRouter);


app.use(errors);
app.listen(PORT, () => debug('SERVER UP AT PORT ', PORT));