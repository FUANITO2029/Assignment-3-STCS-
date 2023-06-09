const express = require('express');
const ruta = express.Router();
const Album = require('../models/album_model');
const Song = require('../models/song_model');

ruta.get('/:id', (req, res)=> {
    const id = req.params.id;
    const result = listSongsOnAlbum(id);
    result.then(songs => {
        res.send(songs);
    }).catch(err => {
        res.status(400).send(err.message);
    });
});

ruta.get('/:idAlbum/:idSong', (req, res)=> {
    const idAlbum = req.params.idAlbum;
    const idSong = req.params.idSong;
    const result = seeSongOnAlbum(idAlbum, idSong);
    result.then(song => {
        res.send(song);
    }).catch(err => {
        res.status(400).send(err.message);
    });
});

ruta.post('/:idAlbum/:idSong', (req, res) =>{
    const idAlbum = req.params.idAlbum;
    const idSong = req.params.idSong;
    const condition = songIsRegistered(idSong);
    condition.then( () => {
        const result = recordSongOnAlbum(idAlbum, idSong);
        result.then(album =>{
            res.send(album);
        }).catch(err => {
            res.status(400).send(err.message);
        }); 
    }).catch(err => {
        res.status(400).send(err.message);
    });
    
});

ruta.delete('/:idAlbum/:idSong', (req, res) =>{
    const idAlbum = req.params.idAlbum;
    const idSong = req.params.idSong;
    const result = deleteSongOnAlbum(idAlbum, idSong);
    result.then(album =>{
        res.send(album);
    }).catch(err => {
        res.status(400).send(err.message);
    })
});

async function listSongsOnAlbum(idAlbum){
    const albums = await Album.findById(idAlbum)
                                .select({title: 1, songs: 1, _id: 1});
    return albums;
}

async function seeSongOnAlbum(idAlbum, idSong){
    const album = await Album.findOne({_id: idAlbum});
    if(!album){
        throw new Error('the song is not exist');
    }
    const song = await Song.find({_id: idSong});
    return song;
}

async function recordSongOnAlbum(idAlbum, idSong){
    const song = await Song.findOne({_id: idSong});
    if(!song){
        throw new Error('the song does not exist');
    }
    const result = await Album.updateOne({_id: idAlbum}, {
        $addToSet: {
            songs: idSong
        }
    });
    if(!result.matchedCount){
        throw new Error('the album does not exist');
    }
    if(!result.modifiedCount){
        throw new Error('the song is already registered on the album');
    }
    const album = await Album.findById(idAlbum);
    return album;
}

async function deleteSongOnAlbum(idAlbum, idSong){
    const song = await Song.findOne({_id: idSong});
    if(!song){
        throw new Error('the song does not exist');
    }
    const result = await Album.updateOne({_id: idAlbum}, {
        $pullAll: {
            songs: [idSong]
        }
    });
    if(!result.matchedCount){
        throw new Error('the album does not exist');
    }
    if(!result.modifiedCount){
        throw new Error('the song is not registered on the album');
    }
    const album = await Album.findById(idAlbum);
    return album;
}

async function songIsRegistered(idSong){
    const album = await Album.findOne({songs: idSong});
    if(album){
        throw new Error('the song is already registered on other album')
    }
}

module.exports = ruta;