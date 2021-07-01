const express = require('express');
const router = express.Router();
const places = require('../controllers/places');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Place = require('../models/place');
// const User = require('../models/user');

const { isLoggedIn, isAuthor, validatePlace } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' });


// RESTFUL ROUTING
router.get('/', catchAsync(places.index));

router.get('/new', isLoggedIn, places.renderNewForm);

// router.post('/', isLoggedIn, upload.single('image'), validatePlace, catchAsync(places.createPlace));
router.post('/', upload.array('image'), (req, res) => {
    console.log(req.body, req.files);
    res.send('it worked');
});

router.get('/:id', catchAsync (places.showPlace));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(places.renderEditForm));


router.put('/:id', isLoggedIn, isAuthor, validatePlace, catchAsync(places.updatePlace));


router.delete('/:id', isLoggedIn, isAuthor, catchAsync(places.deletePlace));

module.exports = router;