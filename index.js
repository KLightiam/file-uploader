require('dotenv').config();
const path = require("node:path");
const express = require("express");
const logoutRouter = require('./routes/logoutRouter');
const signUpRouter = require('./routes/signUpRouter');
const indexRouter = require('./routes/indexRouter');
const { expressSession } = require('./utils/expressSession');
const { passportSession, passportAuthenticate, usePassport, serialize, deserialize } = require('./controller/passportController');
const userRouter = require('./routes/userRouter');

const app = express();

app.set("views",path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')));
app.use(expressSession);
app.use(passportSession);
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);
app.use("/log-out",logoutRouter);
app.post("/log-in",passportAuthenticate); 
app.use("/",userRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Fileuploader app - listening on port ${PORT}!`));
