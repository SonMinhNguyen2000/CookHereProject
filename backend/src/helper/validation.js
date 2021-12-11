const joi = require('joi');
const registerSchema = joi.object({
    username: joi.string(),
    email: joi.string().min(6).max(50).email(), 
    password: joi.string().min(6).max(255) 
});

const loginSchema = joi.object({
    email: joi.string().min(6).max(50).email(),
    password: joi.string().min(6).max(255)
});

const emailSchema = joi.object({
    email: joi.string().min(6).max(50).email()
});

module.exports = {registerSchema, loginSchema, emailSchema};