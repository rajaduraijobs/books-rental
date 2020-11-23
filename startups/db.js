const mongoose = require('mongoose');
const winston = require('winston');

module.exports = async function() {
//mongodb+srv://root:Qwe6xFK9uuatX3fx@cluster0.uyqaa.mongodb.net/books-rental?retryWrites=true&w=majority
    await mongoose.connect('mongodb://localhost/book-rental', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => winston.info('Connected to MongoDB...'))  
}