const mongoose = require('mongoose');
const Place = require('../models/place');
const cities = require('./cities');

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

const seedDB = async () => {
    await Place.deleteMany({});
    // const c = new Place({ location: 'Frankfurt, Germany' });
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const pla = new Place({
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        }) 
        await pla.save();
    }
   
}

seedDB().then(() => {
    mongoose.connection.close();
})