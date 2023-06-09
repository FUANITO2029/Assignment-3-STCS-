const express = require('express');
const ruta = express.Router();
const Singer = require('../models/singer_model');
const Album = require('../models/album_model');

ruta.get('/:id', (req, res)=> {
    const id = req.params.id;
    const result = listAlbumsOnSinger(id);
    result.then(albums => {
        res.send(albums);
    }).catch(err => {
        res.status(400).send(err.message);
    })
});

ruta.get('/:idSinger/:idAlbum', (req, res)=> {
    const idSinger = req.params.idSinger;
    const idAlbum = req.params.idAlbum;
    const result = seeAlbumOnSinger(idSinger, idAlbum);
    result.then(album => {
        res.send(album);
    }).catch(err => {
        res.status(400).send(err.message);
    })
})

ruta.post('/:idSinger/:idAlbum', (req, res)=> {
    const idSinger = req.params.idSinger;
    const idAlbum = req.params.idAlbum;
    const condition = albumIsRegistered(idAlbum);
    condition.then( () => {
        const result = recordAlbunOnSinger(idSinger, idAlbum);
        result.then( singer => {
            res.send(singer);
        }).catch(err =>{
            res.status(400).send(err.message);
        });
    }).catch(err => {
        res.status(400).send(err.message);
    });
    
});

ruta.delete('/:idSinger/:idAlbum', (req, res) =>{
    const idSinger = req.params.idSinger;
    const idAlbum = req.params.idAlbum;
    const result = deleteAlbunOnSinger(idSinger, idAlbum);
    result.then(singer =>{
        res.send(singer);
    }).catch(err => {
        res.status(400).send(err.message);
    });
});

async function listAlbumsOnSinger(idSinger){
    const albums = await Singer.findById(idSinger)
                                .select({name: 1, nationality: 1, birth: 1, albums: 1, _id: 1});
    return albums;
}

async function seeAlbumOnSinger(idSinger, idAlbum){
    const singer = await Singer.findOne({_id: idSinger});
    if(!singer){
        throw new Error('the singer does not exist');
    }
    const album = await Album.find({_id: idAlbum});
    return album;
}

async function recordAlbunOnSinger(idSinger, idAlbum){
    const album = await Album.findOne({_id: idAlbum});
    if(!album){
        throw new Error('the albun does not exist');
    }
    const result = await Singer.updateOne({_id: idSinger}, {
        $addToSet: {
            albums: idAlbum  // Controla que el correo sea unico ( es un conjunto)
                        // Si el correo ya esta en el curso, no hae nada 
        }
    });
    if(!result.matchedCount){
        throw new Error('the singer does not exist');
    }
    if(!result.modifiedCount){
        throw new Error('the album is already registered on the singer');
    };
    const singer = await Singer.findById(idSinger);
    return singer;
}

async function deleteAlbunOnSinger(idSinger, idAlbum){
    const album = await Album.findOne({_id: idAlbum});
    if(!album){
        throw new Error('the albun does not exist');
    }
    const result = await Singer.updateOne({_id: idSinger}, {
        $pullAll: {
            albums: [idAlbum]
        }
    });
    if(!result.matchedCount){
        throw new Error('the singer does not exist');
    }
    if(!result.modifiedCount){
        throw new Error('the album is not registered on the singer');
    };
    const singer = await Singer.findById(idSinger);
    return singer;
}

async function albumIsRegistered(idAlbum){
    const singer = await Singer.findOne({albums: idAlbum});
    if(singer){
        throw new Error('the album is already registered on other singer');
    }
    return;
}

module.exports = ruta;