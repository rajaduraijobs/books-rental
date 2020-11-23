const jwt = require('jsonwebtoken');
const Joi = require('joi');
require('dotenv').config();
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details);

  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).send({message: 'User already registered'});

  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();    
  
  res.send(_.pick(user, ['_id', 'name', 'email']));
});

router.post('/login', async (req, res) => {

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details);

  let user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(400).send({message: 'Invalid email or password'});

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send({message: 'Invalid email or password'});

  const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);
  res.json({accessToken: accessToken});

});

router.get('/me', async (req, res) => {

  const isValidId = await isValidObjectId(req.params.id);
  if(!isValidId) return res.status(404).json({ message: 'Invalid Id'});

  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(255).required()
  });
  return schema.validate(user);
}


module.exports = router; 