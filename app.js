const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Place = require('./models/place');

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


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))




app.get('/', (req, res) => {
    res.render('home')
})

// app.get('/makeplace', async (req, res) => {
//     const plac = new Place({ location: 'Dallas, Texas', description: 'blah blah!'});
//     await plac.save();
//     res.send(plac);
// })

// RESTFUL ROUTING
app.get('/places', async (req, res) => {
    const places = await Place.find({});
    res.render('places/index', { places });
})

app.get('/places/new', (req, res) => {
    res.render('places/new');
})

app.post('/places', async (req, res) => {
    // res.send(req.body);
    const place = new Place(req.body.place);
    await place.save();
    res.redirect(`/places/${place._id}`)
})

app.get('/places/:id', async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/show', { place });
})

app.get('/places/:id/edit', async (req, res) => {
    const place = await Place.findById(req.params.id)
    res.render('places/edit', { place });
})


app.put('/places/:id', async (req, res) => {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, {...req.body.place });
    res.redirect(`/places/${place._id}`);
})


app.delete('/places/:id', async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.redirect('/places');

})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})