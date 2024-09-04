const express = require('express');
const router = express.Router();
const passport = require('passport');
const { createUser, makeMember, addStorie, getStories } = require('../db/user');

router.get('/', (req, res) => {
    res.render("index");
});

router.get('/signup', (req, res) => {
    res.render("signup");
});
router.post('/signup', async(req, res) => {
    const { email, password } = req.body;
    try {
        await createUser(email, password);
        res.redirect("/login");
    } catch (err) {
        console.error("Error during signup:", err);
        res.redirect("/signup");
    }
});

router.get('/login', (req, res) => {
    res.render("login");
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
  }));

  router.get('/logout', (req, res) => {
    req.logOut;
    res.redirect("/login");
  });

  router.get('/home', async (req, res) => {
    const stories = await getStories();
    const authenticated = req.user;
    res.render('home', { authenticated, stories });
  });

  router.post('/home', async (req, res) => {
    let passCode = req.body.passcode;
    if (passCode === 'anaconda' && req.user) {
        try {
            await makeMember(req.user);
            res.redirect('/home');
        } catch (err) {
            console.log(err);
            res.redirect('/home');
        }
    } else {
        res.redirect('/home');
    }
  });

  router.post('/new-storie', async (req, res) => {
    const storie = req.body.newMessage;
    const author = req.user;
    try {
        await addStorie(storie, author);
        res.redirect('/home');
    } catch (err) {
        console.log(err);
        res.redirect('/home');
    }
  });
  
  module.exports = router;