const express = require('express');
const router = express.Router();
const passport = require('passport');
const { createUser } = require('../db/user');

router.get('/signup', (req, res) => {
    res.render("signup");
});
router.post('/signup', async(req, res) => {
    const { email, password } = req.body;
    try {
        await createUser(email, password);
        res.redirect("/login");
    } catch (err) {
        res.redirect("/signup");
    }
})

router.get('/login', (req, res) => {
    res.render("login");
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

  router.get('/logout', (req, res) => {
    req.logOut;
    res.redirect("/login");
  })

  module.exports = router;