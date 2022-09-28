const Joi = require('joi');
const { password } = require('../utils/customValidation');

const registerWithEmailAndPassword = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const registerWithInviteToken = {
  params: Joi.object().keys({
    // TODO: Convert this from string to UUID or token format
    inviteToken: Joi.string().required(),
  }),
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().max(6).required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  params: Joi.object().keys({
    // TODO: Convert this from string to UUID or token format
    resetToken: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    passwordcheck: Joi.any().equal(Joi.ref('password')).required().messages({
      'any.only': 'Password does not match',
    }),
  }),
};

module.exports = {
  registerWithEmailAndPassword,
  registerWithInviteToken,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
};
