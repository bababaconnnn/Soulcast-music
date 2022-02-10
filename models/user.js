var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String,
    Bday: String,
    Bmonth: String,
    Byear: String,
    role: {
        type: String,
        default: 'User'
    },
    profileImage:{
        type: String,
        default: 'https://res.cloudinary.com/dhr9ac0xa/image/upload/v1619505754/585e4bf3cb11b227491c339a_bmxd2w.png'
    },
    plan: {
        type: String,
        default: 'Free'
    },
    favorite: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'song'
        }
    ],
    follow: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artist'
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user',userSchema);