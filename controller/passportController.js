const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();




const passportAuthenticate = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  });

const passportSession = passport.session();

const usePassport =  passport.use(
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
const serialize =  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
const deserialize =  passport.deserializeUser(async (id, done) => {
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

module.exports = {passportAuthenticate,passportSession, usePassport, serialize, deserialize};