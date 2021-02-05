const winston = require('winston');
const express = require('express');
const app = express(); 

app.use(express.json());
require('./startup/routes')(app);
require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/db')();
require('./startup/prod')(app);

const server = app.listen(3000,()=> winston.info('Connected to port 3000'));
module.exports = server;