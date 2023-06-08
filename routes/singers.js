const express = require('express');
const ruta = express.Router();
const Singer = require('../models/singer_model');
const Joi = require('joi').extend(require('@joi/date'));

// ruta.get('/', (req, res) => {
//     res.send('Listo el Get de singers');
// });

const schema = new Joi.object({
    nombre:         Joi.string()
                        .min(3)
                        .max(20)
                        .required(),
    nacionalidad:   Joi.string()
                        .min(3)
                        .max(15)
                        .required(),
    nacimiento:     Joi.date()
                        .format('DD-MM-YYYY')
                        .max('now')
                        .required()
});

ruta.post('/', (req, res)=>{
    const body = req.body;
    const {error, value} = schema.validate({
        nombre: body.nombre, nacionalidad: body.nacionalidad, nacimiento: body.nacimiento
    });

    if(!error){

        const cantante = buscarNombre(body.nombre);
        cantante.then(cantante =>{
            if(cantante[0]){
                res.status(400).send('the name already exists');
                return;
            }     
            
            const result = createSinger(body);
            result.then(singer => {
                res.send({
                    nombre: singer.name, 
                    nacionalidad: singer.nationality,
                    nacimiento: singer.birth
                });
            }).catch(err => {
                res.send(err.message);
            });

        }).catch(err => {
            res.send(err.message);
        })
    }else{
        res.status(400).send(error.details[0].message); 
    }
     
});

ruta.get('/', (req, res)=>{
    const result = readSingers();
    result.then( singer => {
        res.send(singer);
    })
    .catch(err => {
        res.status(400).send(err.message);
    })
});

ruta.get('/:id', (req, res)=>{
    const id = req.params.id;
    const result = readSinger(id);
    result.then( singer => {
        res.send(singer);
    })
    .catch(err => {
        res.status(400).send(err.message);
    })
});

ruta.put('/:id', (req, res)=>{
    const id = req.params.id;
    const body = req.body;
    const {error, value} = schema.validate({
        nombre: body.nombre, nacionalidad: body.nacionalidad, nacimiento: body.nacimiento
    });
    if(!error){
        const cantante = buscarNombre(body.nombre);
        cantante.then(cantante =>{
            if(cantante[0]){
                res.send('the name already exists');
                return;
            }

            const singer = updateSinger(id, body);
            singer.then(singer => {
                res.send({
                    nombre: singer.name,
                    nacionalidad: singer.nationality,
                    nacimiento: singer.birth
                });
            }).catch(err => {
                res.send(err.message);
            });

        }).catch(err => {
            res.send(err.message);
        })

    }else{
        res.status(400).send(error.details[0].message); 
    }
});

ruta.delete('/:id', (req, res)=>{
    const id = req.params.id;
    const singer = deleteSinger(id);
    singer.then(singer => {
        res.send('has been delete \n' + singer);
    }).catch(err => {
        res.send(err.message);
    })
});

async function createSinger(body){
    const singer = new Singer({
        name:        body.nombre,
        nationality: body.nacionalidad,
        birth:       body.nacimiento
    });
    return await singer.save();
}

async function readSingers(){
    const singers = await Singer.find()
                                .select({name:1, nationality:1, birth:1, albums:1, _id:0});
    return singers;
}

async function readSinger(id){
    const singer = await Singer.find({_id: id});
    return singer;
}

async function updateSinger(id, body){
    const singer = await Singer.findOneAndUpdate({_id: id}, {
        $set: {
            name: body.nombre,
            nationality: body.nacionalidad,
            birth: body.nacimiento
        }
    }, {new: true});
    return singer;
}

async function deleteSinger(id){
    const singer = await Singer.findByIdAndDelete(id);
    return singer;
}

async function buscarNombre(nombre){
    const singer = await Singer.find({name: nombre});
    return singer;
}

module.exports = ruta;