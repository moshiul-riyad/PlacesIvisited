const Place = require('../models/place');

module.exports.index = async (req, res, next) => {
    const places = await Place.find({});
    res.render('places/index', { places });
}

module.exports.renderNewForm = (req, res) => {
    res.render('places/new');
}

module.exports.createPlace = async (req, res, next) => {
    // res.send(req.body);
    // if (!req.body.place) throw new ExpressError('Invalid Place Data', 400);
    const place = new Place(req.body.place);
    place.author = req.user._id;
    await place.save();
    req.flash('success', 'Successfully made a new Place!');
    res.redirect(`/places/${place._id}`)
}

module.exports.showPlace = async (req, res) => {
    const place = await Place.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(place);
    if (!place) {
        req.flash('error', 'Could not find the Place');
        return res.redirect('/places');
    }
    res.render('places/show', { place });
}


module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const place = await Place.findById(id)
    if (!place) {
        req.flash('error', 'Could not find the Place');
        return res.redirect('/places');
    }
    res.render('places/edit', { place });
}


module.exports.updatePlace = async (req, res, next) => {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, {...req.body.place });
    req.flash('success', 'Successfully updated the Place!');
    res.redirect(`/places/${place._id}`);
}


module.exports.deletePlace = async (req, res, next) => {
    const { id } = req.params;
    
    await Place.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the Place!');
    res.redirect('/places');
}