const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const Place = require('../models/place');


// REGISTER ROUTES
router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.register));


// LOGIN ROUTES
router.get('/login', users.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

// SHOW profiles ROUTES
router.get('/users/:id', function(req, res) {
    User.findById(req.params.id, function(err, registeredUser) {
        if(err) {
            req.flash('error', e.message);
            res.redirect('/');
        }
        Place.find().where('author.id').equals(registeredUser._id).exec(function(err, places) {
            if (err) {
                req.flash('error', e.message);
                res.redirect('/');
            }
            res.render('users/showpro', {user: registeredUser, places: places });
        });
    });
});

module.exports = router;
