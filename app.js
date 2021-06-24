const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { placeSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Place = require('./models/place');
const Review = require('./models/review');
const { validate } = require('./models/place');

mongoose.connect('mongodb://localhost:27017/places-i-visited', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected...');
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "public")));

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


// PLACES RESTFUL
app.get('/', (req, res) => {
    res.render('home')
})

// app.get('/makeplace', async (req, res) => {
//     const plac = new Place({ location: 'Dallas, Texas', description: 'blah blah!'});
//     await plac.save();
//     res.send(plac);
// })

// RESTFUL ROUTING
app.get('/places', catchAsync( async (req, res, next) => {
    const places = await Place.find({});
    res.render('places/index', { places });
}))

app.get('/places/new', (req, res) => {
    res.render('places/new');
})

app.post('/places', validatePlace, catchAsync( async (req, res, next) => {
    // res.send(req.body);
    // if (!req.body.place) throw new ExpressError('Invalid Place Data', 400);
    const place = new Place(req.body.place);
    await place.save();
    res.redirect(`/places/${place._id}`)
}))

app.get('/places/:id', catchAsync (async (req, res, next) => {
    const place = await Place.findById(req.params.id).populate('reviews');
    res.render('places/show', { place });
}))

app.get('/places/:id/edit', catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id)
    res.render('places/edit', { place });
}))


app.put('/places/:id', validatePlace, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, {...req.body.place });
    res.redirect(`/places/${place._id}`);
}))


app.delete('/places/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.redirect('/places');
}))

// REVIEWS ROUTES
app.post('/places/:id/reviews', validateReview, catchAsync(async(req, res) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    place.reviews.push(review);
    await review.save();
    await place.save();
    res.redirect(`/places/${place._id}`);
}))

app.delete('/places/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/places/${id}`);
}))

// ERRORS
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!!!'
    res.status(statusCode).render('error', { err })
    // res.send("Something Went Wrong!!!");
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})