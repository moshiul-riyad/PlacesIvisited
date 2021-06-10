const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    location: String,
    description: String,
    image: String
    
})

module.exports = mongoose.model('Place', PlaceSchema);