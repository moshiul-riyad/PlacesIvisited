const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
// const { placeSchema, reviewSchema } = require('./schemas.js');
// const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');


const { validate } = require('./models/place');

const places = require('./routes/places');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/places-i-visited', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/places', places);
app.use('/places/:id/reviews', reviews);


// PLACES RESTFUL
app.get('/', (req, res) => {
    res.render('home')
})

// app.get('/makeplace', async (req, res) => {
//     const plac = new Place({ location: 'Dallas, Texas', description: 'blah blah!'});
//     await plac.save();
//     res.send(plac);
// })



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