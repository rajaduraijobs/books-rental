const express = require('express');
const genres = require('../routes/genres');
const books = require('../routes/books');
const customers = require('../routes/customers');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const error = require('../middlewares/error');

module.exports = function(app) {

    app.use(express.json());
    app.use('/api/genres', genres);
    app.use('/api/books', books);
    app.use('/api/customers', customers);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use(error);    
}