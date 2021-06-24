const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    title: String,
    location: String,
    description: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

PlaceSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany({
             _id: {
                 $in: doc.reviews
             }
        })
    }
})

module.exports = mongoose.model('Place', PlaceSchema);