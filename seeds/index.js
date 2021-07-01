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
    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const pla = new Place({
            author: '60d9fafd4ea34e351cbc38da',
            title: "Ruby Beach",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, eius aspernatur natus quo dolor cumque iure quibusdam aliquam reprehenderit sit',
            images: [
                {
                  url: 'https://res.cloudinary.com/dizmicoat/image/upload/v1625148422/PlacesIVisited/gerfaojlkfprhkrigune.jpg',
                  filename: 'PlacesIVisited/gerfaojlkfprhkrigune'
                },
                {
                  url: 'https://res.cloudinary.com/dizmicoat/image/upload/v1625148422/PlacesIVisited/sdky3tnxyf1jfabr2vgn.jpg',
                  filename: 'PlacesIVisited/sdky3tnxyf1jfabr2vgn'
                }
            ]    
        }) 
        await pla.save();
    }
   
}

seedDB().then(() => {
    mongoose.connection.close();
})