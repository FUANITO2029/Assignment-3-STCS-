const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        require: false
    },
    label: {
        type: String,
        require: false
    },
    genre: {
        type: String,
        require: false
    },
    year:{
        type: Number,
        require: false
    },
    songs:{
        type: []
    }
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;