const {Router} = require('express');
const indexRouter = Router();
const {index} = require('../controller/userController')

indexRouter.get('/', index);



module.exports = indexRouter;