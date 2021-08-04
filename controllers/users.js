const User = require('../models/user');
const Place = require('../models/place');

const express = require('express');
const router = express.Router();


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, firstName, lastName, avatar } = req.body;
        const user = new User({ email, username, firstName, lastName, avatar });
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser, err => {
            if (err) return next (err);
            req.flash('success', 'Welcome to our Community!');
            res.redirect('/places');
        })    
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}


module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}


module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!'); 
    const redirectUrl = req.session.returnTo || '/places';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/places');
}

// module.exports.userProfile = function(req, res) {
    
//     User.findById(req.params.id, function(err, registeredUser) {
//       if(err) {
//         req.flash("error", "Something went wrong.");
//         return res.redirect("/");
//       }
//       Place.find().where('author.id').equals(registeredUser._id).exec(function(err, places) {
//         if(err) {
//           req.flash("error", "Something went wrong.");
//           return res.redirect("/");
//         }
//         res.render("users/showpro", {user: registeredUser, places: places });
//         });
//     });
// }

module.exports.userProfile =  async (req, res) => {
    let curUser = await User.findById(req.params.id);
    let places = await Place.find({
        author: curUser._id
    });
    // console.log(curUser);
    // console.log(places);
    res.render('users/showpro', { user: curUser, places: places });
    // res.send('Done');
};

