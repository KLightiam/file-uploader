const {logout} = require('../controller/userController')
const {Router} = require('express');
const logoutRouter = Router();


logoutRouter.get("/", logout);


module.exports = logoutRouter;