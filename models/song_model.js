const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    length: {
        type: String,
        require: true
    }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;