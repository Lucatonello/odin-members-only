const express = require('express');
const router = express.Router();
const passport = require('passport');
const { createUser, makeMember, addStorie, getStories, makeAdmin } = require('../db/user');

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
    failureRedirect: '/login',
}), async (req, res) => {
    if (req.user) {
        const user = req.user;

        if (user.status === 'member') {
            req.session.isMember = true;
        }
        if (user.status === 'admin') {
            req.session.isAdmin = true;
        }
    }
    res.redirect('/home');
});

  router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            console.log('error loging out', err);
            return res.redirect('/home');
        }
        res.redirect("/");
    });
  });

  router.get('/home', async (req, res) => {
    const stories = await getStories();
    const authenticated = req.user;
    const isMember = req.session.isMember === true;
    const isAdmin = req.session.isAdmin === true;
    res.render('home', { authenticated, stories, isMember, isAdmin });
  });

  router.post('/home', async (req, res) => {
    let passCode = req.body.passcode;
    if (passCode === 'anaconda' && req.user && req.user.status !== 'member') {
        try {
            req.session.isMember = true;
            await makeMember(req.user);
            res.redirect('/home');
        } catch (err) {
            console.log(err);
            res.redirect('/home');
        }
    } else if (passCode === 'king' && req.user && req.user.status !== 'admin') {
        try {
            req.session.isAdmin = true;
            await makeAdmin(req.user);
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