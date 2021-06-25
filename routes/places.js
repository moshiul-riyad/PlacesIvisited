const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Place = require('../models/place');

const { placeSchema } = require('../schemas.js'); // Joi Schema


// PLACE MIDDLEWARE
const validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// RESTFUL ROUTING
router.get('/', catchAsync( async (req, res, next) => {
    const places = await Place.find({});
    res.render('places/index', { places });
}))

router.get('/new', (req, res) => {
    res.render('places/new');
})

router.post('/', validatePlace, catchAsync( async (req, res, next) => {
    // res.send(req.body);
    // if (!req.body.place) throw new ExpressError('Invalid Place Data', 400);
    const place = new Place(req.body.place);
    await place.save();
    req.flash('success', 'Successfully made a new Place!');
    res.redirect(`/places/${place._id}`)
}))

router.get('/:id', catchAsync (async (req, res, next) => {
    const place = await Place.findById(req.params.id).populate('reviews');
    if (!place) {
        req.flash('error', 'Could not find the Place');
        return res.redirect('/places');
    }
    res.render('places/show', { place });
}))

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id)
    if (!place) {
        req.flash('error', 'Could not find the Place');
        return res.redirect('/places');
    }
    res.render('places/edit', { place });
}))


router.put('/:id', validatePlace, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, {...req.body.place });
    req.flash('success', 'Successfully updated the Place!');
    res.redirect(`/places/${place._id}`);
}))


router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the Place!');
    res.redirect('/places');
}))

module.exports = router;