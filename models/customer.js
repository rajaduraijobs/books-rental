const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },  
  email: {
    type: String,
    required: true,
    maxlength: 255
  }
}));

function validateCustomer(customer) {

    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        email: Joi.string().max(255).email().required()
    });

    return schema.validate(customer);
}

exports.Customer = Customer; 
exports.validate = validateCustomer;