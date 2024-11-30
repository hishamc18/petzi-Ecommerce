const Joi = require('joi');

// validation schema for register
const registerValidation = Joi.object({
  username: Joi.string().min(3).max(15).required().pattern(/^\S+$/),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

// validation schema for login
const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerValidation, loginValidation };
//joi validation