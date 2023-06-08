
const express = require('express');
const mongoose = require('mongoose');

const singers = require('./routes/singers');
const albums = require('./routes/albums');
const songs = require('./routes/songs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/singers', singers);
app.use('/api/albums', albums);
app.use('/api/songs', songs);

mongoose.connect("mongodb://127.0.0.1/music")
            .then(()=> console.log('¡Conectado a MongoDB!'))
            .catch(err => console.log(`No se pudo conectar con MongoDB, ocurrrio: ${err}`));

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`API REST OK en puerto ${port} y ejecutándose...`);
});