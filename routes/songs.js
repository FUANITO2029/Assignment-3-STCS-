const express = require('express');
const ruta = express.Router();
const Song = require('../models/song_model');
const Joi = require('joi');

const schema = Joi.object({
    titulo:     Joi.string()
                    .min(3)
                    .max(20)
                    .required(),
    duracion:   Joi.string()
                    .min(3)
                    .max(8)
                    .required()
});

ruta.post('/', (req, res) => {
    const body = req.body;
    const {error, value} = schema.validate({
        titulo: body.titulo, duracion: body.duracion
    });
    if(!error){
        const result = createSong(body);
        result.then(song => {
            res.send({
                título: song.title,
                duracion: song.length
            });
        }).catch(err => {
            res.status(400).send(err.message);
        })
    }else{
        res.status(400).send(error.details[0].message);
    }
});

ruta.get('/', (req, res) => {
    const resutl = readSongs();
    resutl.then(song => {
        res.send(song);
    }).catch(err => {
        res.status(400).send(err.message);
    })
});

ruta.get('/:id', (req, res) => {
    const id = req.params.id;
    const resutl = readSong(id);
    resutl.then(song => {
        res.send(song);
    }).catch(err => {
        res.status(400).send(err.message);
    })
});

ruta.put('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const {error, value} = schema.validate({
        titulo: body.titulo, duracion: body.duracion
    });
    if(!error){
        const result = updateSong(id, body);
        result.then(song => {
            res.send(song);
        }).catch(err => {
            res.status(400).send(err.message);
        })
    }else{
        res.status(400).send(error.details[0].message);
    }
});

ruta.delete('/:id', (req, res) => {
    const id = req.params.id;
    const result = deleteSong(id);
    result.then(song => {
        res.send('has been delete \n' + song);
    }).catch(err => {
        res.status(400).send(err.message);
    })
});


async function createSong(body){
    const song = new Song({
        title:   body.titulo,
        length:  body.duracion 
    });
    return await song.save();
}

async function readSongs(){
    const songs = await Song.find()
                        .select({title:1, length:1, _id:1});
    return songs;
}

async function readSong(id){
    const song = await Song.find({_id: id});
    return song;
}

async function updateSong(id, body){
    const song = await Song.findOneAndUpdate({_id: id},{
        $set:{
            title:  body.titulo,
            length: body.duracion
        }
    }, {new: true});
    return song;
}

async function deleteSong(id){
    const song = await Song.findByIdAndDelete(id);
    return song;
}

module.exports = ruta;