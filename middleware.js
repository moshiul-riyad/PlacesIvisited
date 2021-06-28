const ExpressError = require('./utils/ExpressError');
const Place = require('./models/place');
const Review = require('./models/review');

const { placeSchema, reviewSchema } = require('./schemas.js'); // Joi Schema


// LOGIN MIDDLEWARE
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be Logged In!');
        return res.redirect('/login');
    }
    next();
}

// PLACE MIDDLEWARE
module.exports.validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// AUTHOR MIDDLEWARE
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized for the action!');
        return res.redirect(`/places/${id}`);
    }
    next();
}

// REVIEW MIDDLEWARE
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized for the action!');
        return res.redirect(`/places/${id}`);
    }
    next();
}