const winston = require('winston')
const express = require('express');
const app = express();
require('./startups/logging')();
require('./startups/routes')(app);
require('./startups/db')();
require('./startups/config')();
require('./startups/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));