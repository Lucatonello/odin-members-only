require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { Pool } = require('pg');
const passportConfig = require('./config/passport');
const app = express();
const path = require("path");
const userRoutes = require('./routes/user');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRoutes);

app.listen(PORT, () => console.log('server running on port ', PORT));