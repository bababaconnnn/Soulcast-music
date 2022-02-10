const album = require('../models/album');

var express = require('express'),
    router = express.Router(),
    // user = require('../models/user'),
    // passport = require('passport');
    song = require('../models/song'),
    artist = require('../models/artist'),
    user = require('../models/user'),
    multer = require('multer'),
    path = require('path'),
    middleware = require('../middleware/middle'),
    storage = multer.diskStorage({
        destination: function(req, file, callback){
            callback(null,'./public/uploads/');
        },
        filename: function(req, file, callback){
            callback(null, file.fieldname + '-'+ Date.now() + path.extname(file.originalname));
        }
    }),
    imageFilter = function(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif|mp3)$/i)){
            return callback(new Error('files are not allowed!'),false);
        }
        callback(null, true);
    },
    upload = multer({storage:storage});

router.post('/add/artist',upload.single('imageArtist'), function(req,res){
    req.body.newArtist.imageArtist = '/uploads/' + req.file.filename;
    // console.log(req.body.newArtist);
    artist.create(req.body.newArtist, function(err,newSong){
        if(err){
            console.log(err);
        }else{
            req.flash('success','Add artist successful')
            res.redirect('/admin/add/artist');
        }
    });
})

router.post('/add/album',upload.single('image'), function(req,res){
    req.body.newAlbum.image = '/uploads/' + req.file.filename;
    // console.log(req.body.newArtist);
    album.create(req.body.newAlbum, function(err,newSong){
        if(err){
            console.log(err);
        }else{
            req.flash('success','Add Album successful')
            res.redirect('/admin/add/album');
        }
    });
})

router.post('/add',upload.fields([{name:'image',maxCount:1},{name:'songs',maxCount:1}]),function(req,res){
    req.body.newReleaseSong.image = '/uploads/' + req.files.image[0].filename;
    req.body.newReleaseSong.songs = '/uploads/' + req.files.songs[0].filename;
    // song.find({}).populate('artist').exec(function(err,findArtist){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log(findArtist);
    //         req.body.newReleaseSong.artist = findArtist;
    //     }
    // });
    // var name = req.body.name;
    // var artist = req.body.artist;
    // var image = req.body.image;
    // var songs = req.body.song;
    // var lyric = req.body.lyric;
    // var releaseDate = req.body.releaseDate;
    // var newReleaseSong = { name:name,
    //                 artist:artist,
    //                 image:image,
    //                 songs:songs,
    //                 lyric:lyric,
    //                 releaseDate:releaseDate };
    song.create(req.body.newReleaseSong, function(err,newSong){
        if(err){
            console.log(err);
        }else{
            req.flash('success','Add song successful')
            res.redirect('/admin/add');
        }
    });
});

router.get('/edit',middleware.isLoggedin, function(req,res){
    song.find({}, function(err, allSong){
        if(err){
            console.log(err);
        }else {
            res.render('showToEdit.ejs', {song: allSong});
        }
    })
    
});
router.get('/edit/artist/:id',middleware.isLoggedin,function(req,res){
    artist.findById(req.params.id, function(err,foundEdit){
        if(err){
            console.log(err);
        }else{
            res.render('editArtist.ejs', {artist: foundEdit});
        }
    })
});
router.put('/editArtist/:id', upload.single('imageArtist'), function(req,res){
    if(req.file){
        req.body.updateArtist.imageArtist = '/uploads/' + req.file.filename;
    }
    artist.findByIdAndUpdate(req.params.id, req.body.updateArtist, function(err, updateSong){
        if(err){
            console.log(err);
            req.flash('error','Can not Update Artist');
        } else{
            req.flash('success', 'Update Artist Successful');
            res.redirect('/admin/edit/artist/'+ req.params.id);
        }
    })
});
router.delete('/deleteArtist/:id', function(req,res){
    console.log(req.params.id);
    artist.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash('error','Can not delete Artist');
        } else{
            req.flash('success', 'Delete Artist Successful');
            res.redirect('/admin/add/artist');
        }
    })
});
router.get('/edit/:id',middleware.isLoggedin,function(req,res){
    song.findById(req.params.id, function(err,foundEdit){
        if(err){
            console.log(err);
        }else{
            res.render('edit.ejs', {song: foundEdit});
        }
    })
});
router.put('/:id', upload.fields([{name:'image',maxCount:1},{name:'songs',maxCount:1}]), function(req,res){
    if(req.files){
        if(typeof(req.files.image) != 'undefined'){
            req.body.updateSong.image = '/uploads/' + req.files.image[0].filename;
            // console.log(req.files.image[0].filename);
        }
        if(typeof(req.files.songs) != 'undefined'){
            req.body.updateSong.songs = '/uploads/' + req.files.songs[0].filename;
            // console.log(req.files.songs[0].filename);
        }
    } else {
        req.body.updateSong.image = undefined;
        req.body.updateSong.songs = undefined;
    }
    song.findByIdAndUpdate(req.params.id, req.body.updateSong, function(err, updateSong){
        if(err){
            console.log(err);
            req.flash('error','Can not Update Song');
        } else{
            req.flash('success', 'Update Song Successful');
            res.redirect('/admin/edit/'+ req.params.id);
        }
    })
});

router.delete('/:id', function(req,res){
    song.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash('error','Can not delete Song');
        } else{
            req.flash('success', 'Delete Song Successful');
            res.redirect('/admin/edit');
        }
    })
});

router.delete('/delete/:id', function(req,res){
    user.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash('error','Can not delete User');
        } else{
            req.flash('success', 'Delete User Successful');
            res.redirect('/admin/manageUser');
        }
    })
});

router.get('/manageUser',middleware.isLoggedin, function(req,res){
    user.find({}, function(err, allUser){
        if(err){
            console.log(err);
        }else {
            res.render('manageUser.ejs', {user: allUser});
        }
    })
    
});

router.get('/manageUser/:id',middleware.isLoggedin,function(req,res){
    user.findById(req.params.id, function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            res.render('userToAdmin.ejs', {user: foundUser});
        }
    })
});

router.put('/user/:id', middleware.isLoggedin,function(req,res){
    user.findByIdAndUpdate(req.params.id, {$set:{role:req.body.role}},{new:true}, function(err, updateUser){
        if(err){
            console.log(err);
            req.flash('error','Can not change to Admin');
        } else{
            req.flash('success', 'Update to admin Successful');
            res.redirect('/admin/manageUser');
        }
    });
});

router.get('/add',middleware.isLoggedin, function(req,res){
    artist.find({}, function(err , searchArtist){
        if(err){
            console.log(err);
        } else {
            res.render('add.ejs', {artist: searchArtist});
        }
    })
    
});
router.get('/add/artist',middleware.isLoggedin, function(req,res){
    artist.find({}, function(err,foundArtist){
        if(err){
            console.log(err);
        }
        else{
            res.render('addArtist.ejs',{artist: foundArtist});
        }
    })
    
});

router.get('/add/album',middleware.isLoggedin, function(req,res){
    artist.find({}, function(err,foundArtist){
        if(err){
            console.log(err);
        }
        else{
            res.render('addalbum.ejs', {artist:foundArtist});
        }
    })
});



router.post('/search',middleware.isLoggedin,function(req,res){
    const word = req.body.search2;
    song.find({$or:[{name: {$regex: word, $options:'i'}}]} , (err, foundSongs) => {
        if(err){
            console.log(err);
        } else {
            res.render('showToEdit.ejs', {song: foundSongs});
        }
    });
});

module.exports = router;