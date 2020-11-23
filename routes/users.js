const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const Joi = require('joi');
require('dotenv').config();
const {User, validate} = require('../models/user');
const _ = require('lodash');
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

    const { error } = validateLogin(req.body); 
    if (error) return res.status(400).send(error.details);

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send({message: 'Invalid email or password'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send({message: 'Invalid email or password'});

    const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken: accessToken});

});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(_.pick(user, ['_id', 'name', 'email']));
});


function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(255).required()
  });
  return schema.validate(user);
}


module.exports = router;