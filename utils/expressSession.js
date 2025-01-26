const session = require("express-session");
const {PrismaSessionStore} = require('@quixo3/prisma-session-store');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const expressSession = session({
    cookie:{
      maxAge: 7 * 24 * 60 * 60 * 1000
    },
    secret: process.env.SESSION_SECRET,
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

  module.exports = {expressSession}