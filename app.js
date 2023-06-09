
const express = require('express');
const mongoose = require('mongoose');

const singers = require('./routes/singers');
const albums = require('./routes/albums');
const songs = require('./routes/songs');
const album_on_singer = require('./routes/album_on_singer');
const song_on_album = require('./routes/song_on_album');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/singers', singers);
app.use('/api/albums', albums);
app.use('/api/songs', songs);
app.use('/api/album_on_singer', album_on_singer);
app.use('/api/song_on_album', song_on_album);

mongoose.connect("mongodb://127.0.0.1/music")
            .then(()=> console.log('¡Conectado a MongoDB!'))
            .catch(err => console.log(`No se pudo conectar con MongoDB, ocurrrio: ${err}`));

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`API REST OK en puerto ${port} y ejecutándose...`);
});