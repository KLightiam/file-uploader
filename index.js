const path = require("node:path");
const express = require("express");
const session = require("express-session");
const multer = require('multer');
const {PrismaSessionStore} = require('@quixo3/prisma-session-store');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
const {PrismaClient} = require('@prisma/client');
const {body, validationResult} = require("express-validator");
const prisma = new PrismaClient();

const upload = multer({dest: "./public/data/uploads/",limits:{fileSize: 1024*1024*5}});

const app = express();

app.set("views",path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static('public'));

app.use(
  session({
    cookie:{
      maxAge: 7 * 24 * 60 * 60 * 1000
    },
    secret: "cats", 
    resave: false, 
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.render("index", {user: req.user}));
//// app.js

app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.get("/log-out", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
  

// validate user details
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

 //sign up
app.post("/sign-up", validateUser, async (req, res, next) => {
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
  });
  
  //passport: check if passwords match
  passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where:{
                    username: username,
                },
                include:{
                  files: true
                }
            })
            if(!user){
                return done(null, false, {message: "Incorrect username"});
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                return done(null, false, {message: "Incorrect password"});
            }
            return done(null, user);
        }catch(err){
            return done(err);
        }
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try{
        user = await prisma.user.findUnique({
            where:{
                id:id,
            },
            include:{
              files: true
            }
        })
        done(null, user);
    }catch(err){
        done(err);
    }
  })

//sign in
app.post("/log-in",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
);
  
//uploads
app.post('/:id/uploads', upload.array('upload',10), (req,res,next)=>{
  try{
    if(!req.files || req.files.length === 0){
    return res.redirect('/');
    }
   const userId = req.params.id;
  //  console.log(username);


  //  const fileDetails = req.files.map((file)=>{
  //   return{
  //     name: file.originalname,
  //     size: (file.size / 1024).toFixed(2),
  //     path: file.path
  //   }
  //  })
  const files = req.files;
  files.forEach(async(file)=>{
     await prisma.user.update({
      where:{
        id:userId
      },
      data:{
        files:{
          create:{
            name: file.originalname,
            storedName: file.filename
          }
        }
      }
     })
  })

  res.redirect('/');
   

  }catch(err){
    console.log(err);
  }

})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Fileuploader app - listening on port ${PORT}!`));
