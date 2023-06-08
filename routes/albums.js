const express = require('express');
const ruta = express.Router();
const Album = require('../models/album_model');
const Joi = require('joi');

const schema = Joi.object({
    titulo:     Joi.string()
                    .min(3)
                    .max(30)
                    .required(),
    discografia: Joi.string()
                    .min(3)
                    .max(30)
                    .required(),
    genero:      Joi.string()
                    .min(3)
                    .max(30)
                    .required(),
    año:       Joi.number()
                    .integer()
                    .positive()       
                    .greater(1500)
                    .less(2024)
});

// ruta.get('/', (req, res) => {
//     res.send('Listo el Get de albums');
// });

ruta.post('/', (req, res) =>{
    const body = req.body;
    const {error, vlaue} = schema.validate({
        titulo: body.titulo, discografia: body.discografia, genero: body.genero, año: body.año
    });

    if(!error){
        const condition = findTitleGenreYear(body);
        condition.then(condition => {
            if(condition[0]){
                res.status(400).send('there is already an album with the same title, genre and year');
                return;
            }

            const result = createAlbum(body);
            result.then( album => {
                res.send({
                    título: album.title,
                    discografía: album.label,
                    género: album.genre,
                    año: album.year
                });
            }).catch(err => {
                res.status(400).send(err.message);
            });

        }).catch(err => {
            res.status(400).send(err.message);
        })
        
    }else{
        res.status(400).send(error.details[0].message);
    }
    
});

ruta.get('/', (req, res) => {
    const result = readAlbums();
    result.then(album => {
        res.send(album);
    }).catch(err => {
        res.status(400).send(err.message);
    })
});

ruta.get('/:id', (req, res)=>{
    const id = req.params.id;
    const result = readAlbum(id)
    result.then(alm => {
        res.send(alm)
    }).catch(err => {
        res.status(400).send(err.message)
    })
});

ruta.put('/:id', (req, res)=> {
    const id = req.params.id;
    const body = req.body;
    const {error, vlaue} = schema.validate({
        titulo: body.titulo, discografia: body.discografia, genero: body.genero, año: body.año
    });

    if(!error){
        const condition = findTitleGenreYear(body);
        condition.then(alm => {
            if(alm[0]){
                res.status(400).send('there is already an album with the same title, genre and year');
                return;
            }

            const result = updateAlbum(id, body);
            result.then(album => {
                res.send(album);
            }).catch(err => {
                res.status(400).send(err.message);
            })

        }).catch(err => {
            res.status(400).send(err.message);
        });
    }else{
        res.status(400).send(error.details[0].message);
    }
});

ruta.delete('/:id', (req, res) =>{
    const result = deleteAlbum(req.params.id);
    result.then(alb =>{ 
        res.send('has been delete \n' + alb);
    }).catch(err => {
        res.status(400).send(err.message);
    })
});

async function createAlbum(body){
    const album = new Album({
        title:  body.titulo,
        label:  body.discografia,
        genre:  body.genero,
        year:   body.año 
    });
    return await album.save();
}

async function readAlbums(){
    const albums = await Album.find()
                            .select({title:1, label:1, genre:1, year:1, _id:0});
    return albums;
}

async function readAlbum(id){
    const album = await Album.find({_id: id});
    return album;
}

async function updateAlbum(id, body){
    const album = await Album.findOneAndUpdate({_id: id},{
        $set:{
            title:  body.titulo,
            label:  body.discografia,
            genre:  body.genero,
            year:   body.año
        }
    }, {new: true});
    return album;
}

async function deleteAlbum(id){
    const album = await Album.findByIdAndDelete(id);
    return album;
}


async function findTitleGenreYear(body){
    const album = await Album.find({title: body.titulo, genre: body.genero, year: body.año});
    return album;
}

module.exports = ruta;




// validar que se pueda actualizar la discografia aun cuando diga q no se puede 