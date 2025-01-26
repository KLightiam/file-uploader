const {body, validationResult, ExpressValidator} = require("express-validator");


const validateUser = [
    body('username').trim()
    .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters long')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers')
    .not().isEmpty().withMessage('Username is required'),

    body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character')
    .not().isEmpty().withMessage('Password is required'),

    body('confirmPassword')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      })
 ];


 module.exports = {validateUser,validationResult,ExpressValidator};