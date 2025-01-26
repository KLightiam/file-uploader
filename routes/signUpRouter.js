const {Router} = require('express');
const { getSignUp, postSignUp } = require('../controller/userController');
const { validateUser } = require('../utils/expressValidator');
const signUpRouter = Router();


signUpRouter.get('/', getSignUp);
signUpRouter.post('/', validateUser, postSignUp);


module.exports = signUpRouter;