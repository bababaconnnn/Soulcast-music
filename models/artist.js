var mongoose = require('mongoose');

var artistSchema = new mongoose.Schema({
    artist: String,
    imageArtist: String,
    follower: {
        type: Number,
        default: '5500'
    }
    // songs: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'song'
    //     }
    // ]

});


module.exports = mongoose.model('Artist',artistSchema);