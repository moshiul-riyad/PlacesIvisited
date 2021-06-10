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
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, eius aspernatur natus quo dolor cumque iure quibusdam aliquam reprehenderit sit',
            image: 'https://images.unsplash.com/photo-1585399000684-d2f72660f092?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80'
        }) 
        await pla.save();
    }
   
}

seedDB().then(() => {
    mongoose.connection.close();
})