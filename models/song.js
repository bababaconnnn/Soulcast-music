var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
    name: String,
    artist: String,
    image: String,
    songs: String,
    lyric: String,
    releaseDate: String,
    album: String,
    listen: {
        type: Number,
        default: '50240'
    },
    category: String
    // artist: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Artist'
    // }
});


module.exports = mongoose.model('song',songSchema);