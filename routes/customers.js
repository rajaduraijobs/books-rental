const {Customer, validate} = require('../models/customer'); 
const auth = require('../middlewares/auth');
const isValidObjectId = require('../validations/objectId');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.post('/', auth, async (req, res) => {

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details);

  const customer = new Customer({ 
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email
  });
  await customer.save();
  
  res.send(customer);
});

router.put('/:id', auth, async (req, res) => {

  const isValidId = await isValidObjectId(req.params.id);
  if(!isValidId) return res.status(404).json({ message: 'Invalid Id'});

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    }, { new: true });

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
  res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {

  const isValidId = await isValidObjectId(req.params.id);
  if(!isValidId) return res.status(404).json({ message: 'Invalid Id'});

  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id', auth, async (req, res) => {

  const isValidId = await isValidObjectId(req.params.id);
  if(!isValidId) return res.status(404).json({ message: 'Invalid Id'});

  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

module.exports = router; 