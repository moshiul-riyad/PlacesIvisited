const User = require('../models/user');
const Place = require('../models/place');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
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