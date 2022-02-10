var mongoose = require('mongoose');

var albumSchema = new mongoose.Schema({
    name: String,
    artist : String,
    image: String,
    allSongs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'song'
    }


});


module.exports = mongoose.model('album',albumSchema);