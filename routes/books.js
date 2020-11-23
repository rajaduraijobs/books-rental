const {Book, validate} = require('../models/book'); 
const isValidObjectId = require('../validations/objectId');
const auth = require('../middlewares/auth');
const {Genre} = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const books = await Book.find().sort('name');
  res.send(books);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details);

  const isExist = await Book.findOne({ title: req.body.title });
  if(isExist) return res.status(400).send({message: 'Title already exist'});

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const book = new Book({ 
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  await book.save();
  
  res.send(book);
});

router.put('/:id', auth, async (req, res) => {

  const isValidId = await isValidObjectId(req.params.id);
  if(!isValidId) return res.status(404).json({ message: 'Invalid Id'});

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const book = await Book.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

  if (!book) return res.status(404).send('The book was not found');
  
  res.send(book);
});

router.delete('/:id', auth, async (req, res) => {

  const isValidId = await isValidObjectId(req.params.id);
  if(!isValidId) return res.status(404).json({ message: 'Invalid Id'});

  const book = await Book.findByIdAndRemove(req.params.id);

  if (!book) return res.status(404).send('The book was not found');

  res.send(book);
});

router.get('/:id', auth, async (req, res) => {

  const isValidId = await isValidObjectId(req.params.id);
  if(!isValidId) return res.status(404).json({ message: 'Invalid Id'});

  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).send('The book was not found');

  res.send(book);
});

module.exports = router; 