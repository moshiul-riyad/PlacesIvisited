const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Place = require('../models/place');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js'); // Joi Schema

// REVIEW MIDDLEWARE
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// REVIEWS ROUTES
router.post('/', validateReview, catchAsync(async(req, res) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success', 'Successfully made a new Review!');
    res.redirect(`/places/${place._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the Review!');
    res.redirect(`/places/${id}`);
}))

module.exports = router;