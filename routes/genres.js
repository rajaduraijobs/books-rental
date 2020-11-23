const {Genre, validate} = require('../models/genre');
const auth = require('../middlewares/auth');
const express = require('express');
const isValidObjectId = require('../validations/objectId');
const isUnique = require('../validations/unique');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details);

  const isExist = await isUnique(req.body.name, Genre);
  if(isExist) return res.status(400).send({message: 'Name already exist'});

  const genre = new Genre({ name: req.body.name });
  await genre.save();
  
  res.send(genre);
});

router.put('/:id', auth, async (req, res) => {

  const isValidId = await isValidObjectId(req.params.id);
  if(!isValidId) return res.status(404).json({ message: 'Invalid Id'});

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details);
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).json({ message: 'Invalid genre Id'});
  
  res.send(genre);
});

router.delete('/:id', auth, async (req, res) => {

  const isValidId = await isValidObjectId(req.params.id);
  if(!isValidId) return res.status(404).json({ message: 'Invalid Id'});

  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).json({ message: 'The genre with the given ID was not found.'});

  res.send(genre);
});

router.get('/:id', auth, async (req, res) => {

  const isValidId = await isValidObjectId(req.params.id);
  if(!isValidId) return res.status(404).json({ message: 'Invalid genre Id'});

  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;