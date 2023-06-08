const mongoose = require('mongoose')

const singerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    nationality: {
        type: String,
        require: true
    },
    birth: {
        type: String,
        require: false
    },
    albums:{
        type: []
    }
});

const Singer = mongoose.model('Singer', singerSchema);

module.exports = Singer;