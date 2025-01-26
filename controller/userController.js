const cloudinary = require('cloudinary').v2
const multer = require('multer');
const {validationResult} = require('../utils/expressValidator')
const bcrypt = require("bcryptjs");
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

//cloudinary config
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//multer config
const storage = multer.diskStorage({
  filename: function(req,file,cb){
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage,limits:{fileSize: 1024*1024*5}});



const logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }

const getSignUp = (req, res) => res.render("sign-up-form")

const postSignUp = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {username, password} = req.body

        const userExists = await prisma.user.findFirst({ 
            where: {
                username: username,
                }
        });
        if (userExists) {
          return res.status(400).json({error: 'username already exists'});
        }
        bcrypt.hash(password,10, async(err, hashedPassword)=>{
            if(err){
                return res.status(400).json({error: err.message})
            }else{
                const user = await prisma.user.create({
                    data:{
                        username: username,
                        password: hashedPassword,
                    },
                })
                req.login(user, (err)=>{
                  if(err){
                    return next(err);
                  }
                  res.redirect("/");
                })
            }
        })

    } catch(err) {
      return next(err);
    }
  };

const userUploads = async(req,res,next)=>{
  try{
    if(!req.files || req.files.length === 0){
    return res.redirect('/');
    }
   const userId = req.params.id;

   const files = req.files;
   files.forEach(async(file)=>{
    const results = await cloudinary.uploader.upload(file.path,{
      folder: "fileuploader"
    });
    const url = await results.url;
    const publicId = await results.public_id;

    await prisma.user.update({
      where:{
        id:userId
       },
       data:{
         files:{
           create:{
             name: file.originalname,
             storedName: file.filename,
             url: url,
             publicId: publicId,
             size: (file.size / (1024 * 1024)).toFixed(2),
             type: file.mimetype,
             date: new Date(),
           }
         }
       }
     })
     res.redirect('/');
   })


  }catch(err){
    console.log(err);
  }

}

const viewFile = async(req,res)=>{
    try{
      // const userId = req.params.userId;
      const fileId = req.params.fileId;
      const file = await prisma.file.findUnique({
        where:{
          id: fileId
        },
        include:{
          owner: true
        }
      })
      res.render('view-file', {file: file});
    }catch(err){
      console.log(err);
    }
  }

const deleteFile = async(req,res)=>{
    try{
      const fileId = req.params.fileId;
      const deletedFile = await prisma.file.delete({
        where:{
          id: fileId
        }
      })
      cloudinary.uploader.destroy(deletedFile.publicId);
      res.redirect('/');
    }catch(err){
      console.log(err);
    }
  }

const index = (req, res) => res.render("index", {user: req.user})





module.exports = {logout, getSignUp, postSignUp, index, upload, userUploads, viewFile, deleteFile}