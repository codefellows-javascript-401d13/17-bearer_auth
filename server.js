'use strict';

const express = require('express');
const debug = require('debug')('quiver:server');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

const userRouter = require('./route/user-route.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

let morganFormat = process.env.PRODUCTION ? 'common' : 'dev';

app.use(cors());
app.use(morgan('dev'));

app.use(userRouter);
app.use(errors);

app.get('/', (req, res) => {
  res.send('this worked');
});

app.listen(PORT, () => {
  debug(`Port up: ${PORT}`);
});
