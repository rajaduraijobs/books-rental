const mongoose = require('mongoose');
const winston = require('winston');

module.exports = async function() {
    await mongoose.connect('mongodb://localhost/book-rental', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => winston.info('Connected to MongoDB...'))  
}