const {Router} = require('express');
const { upload, userUploads, viewFile, deleteFile } = require('../controller/userController');

const userRouter = Router();


userRouter.post('/:id/uploads',upload.array('upload',10), userUploads);
userRouter.get('/:id/view/:fileId', viewFile);
userRouter.post('/:id/delete/:fileId', deleteFile);


module.exports = userRouter;