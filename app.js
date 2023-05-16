if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');


const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const { validate } = require('./models/place');

const placeRoutes = require('./routes/places');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');


// 'mongodb://localhost:27017/places-i-visited'

const MongoDBStore = require("connect-mongo")(session);

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/places-i-visited';


mongoose.connect(dbUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

const app = express();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error!!!:"));
db.once("open", () => {
    console.log("Database Connected!!!");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'badsecret';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e) {
    console.log('SESSION STORE ERROR!', e)
})

const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/places', placeRoutes);
app.use('/places/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


// PLACES RESTFUL
app.get('/', (req, res) => {
    res.render('homep')
})


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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`SERVER IS LISTENING ON PORT ${port}`);
})