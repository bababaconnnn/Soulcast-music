var express = require('express'),
    router = express.Router({mergeParams: true}),
    user = require('../models/user'),
    middleware = require('../middleware/middle'),
    artist = require('../models/artist'),
    song = require('../models/song'),
    album = require('../models/album');


router.get('/premium',middleware.isLoggedin, function(req,res){
    res.render('premium.ejs');
});

router.get('/premium/pay',middleware.isLoggedin, function(req,res){
    res.render('payPremium.ejs');
});

router.post('/premium/pay/complete/:id',middleware.isLoggedin, function(req,res){
    console.log(req.params.id);
    user.findByIdAndUpdate(req.params.id, {$set:{plan:'Soulcast Premium'}},{new:true}, function(err,updateToPremium){
        if(err){
            req.flash('error','Something went wrong');
            console.log(err);
        }else{
            console.log(updateToPremium);
            res.redirect('/soulcast');
        }
    });
});



router.get('/', middleware.isLoggedin, function(req,res){
    song.find({}).sort({releaseDate: -1}).limit(8).exec(function(err, allReleaseSong){
        if(err){
            console.log(err);
        } else {
            // console.log(allReleaseSong);
            res.render('homeUser.ejs', {song: allReleaseSong});
        }
    });
    // song.find({}).populate('artist').exec(function(err,allReleaseSong){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log(allReleaseSong);
            
    //     }
    // });    
});

router.get('/play/:id',middleware.isLoggedin, function(req,res){
    song.findByIdAndUpdate(req.params.id,{$inc:{listen:1}}, function(err, foundSong){
        if(err){
            console.log(err);
        }else{
            res.render('play.ejs', {song: foundSong});
        }
    });
});

router.get('/TopSong',middleware.isLoggedin, function(req,res){
    song.find({}).sort({listen: -1}).limit(10).exec(function(err, topSong){
        if(err){
            console.log(err);
        } else {
            artist.find({}).sort({follower: -1}).limit(6).exec(function(err,topArtist){
                res.render('Top.ejs', {song: topSong, artist:topArtist});
            })
            // console.log(allReleaseSong);
            
        }
    });
});

router.post('/follow/:id',middleware.isLoggedin, function(req,res){
    // console.log(req.body.fav);
    // console.log(req.params.id);
    artist.findByIdAndUpdate(req.params.id,{$inc:{follower:1}}, function(err, foundSong){
        if(err){
            console.log(err);
        }else{
            console.log('add follow');
            user.findByIdAndUpdate(req.user._id,{$push:{follow:req.body.follow}}, function(err, foundSong){
                if(err){
                    console.log(err);
                }else{
                    console.log('push follow success');
                    res.redirect('back');
                }
            });
            
        }
    });
});


router.post('/play/fav/:id',middleware.isLoggedin, function(req,res){
    // console.log(req.body.fav);
    // console.log(req.params.id);
    user.findByIdAndUpdate(req.params.id,{$push:{favorite:req.body.fav}}, function(err, foundSong){
        if(err){
            console.log(err);
        }else{
            console.log('push success');
            
            res.redirect('back');req.flash('successs','Add song to Liked song');
        }
    });
});

router.post('/search/fav/:id',middleware.isLoggedin, function(req,res){
    // console.log(req.body.fav);
    // console.log(req.params.id);
    user.findByIdAndUpdate(req.params.id,{$push:{favorite:req.body.fav}}, function(err, foundSong){
        if(err){
            console.log(err);
        }else{
            console.log('push success');
            req.flash('successs','Add song to Liked song')
            res.render('search.ejs');
        }
    });
});

router.post('/play/fav/delete/:id',middleware.isLoggedin, function(req,res){
    user.findByIdAndUpdate(req.params.id,{$pull:{favorite:req.body.delete}}, function(err, foundSong){
        if(err){
            console.log(err);
        }else{
            console.log('delete fav');
            res.redirect('back');
        }
    });
});

router.post('/unfollow/:id',middleware.isLoggedin, function(req,res){
    artist.findByIdAndUpdate(req.params.id,{$inc:{follower:-1}}, function(err, foundSong){
        if(err){
            console.log(err);
        }else{
            console.log('unfollow');
            user.findByIdAndUpdate(req.user._id,{$pull:{follow:req.body.follow}}, function(err, foundSong){
                if(err){
                    console.log(err);
                }else{
                    console.log('push follow success');
                    res.redirect('back');
                }
            });
        }
    });
});

router.post('/search/delete/:id',middleware.isLoggedin, function(req,res){
    user.findByIdAndUpdate(req.params.id,{$pull:{favorite:req.body.delete}}, function(err, foundSong){
        if(err){
            console.log(err);
        }else{
            console.log('delete fav');
        //     const word = req.body.search;
        //     song.find({$or:[{name: {$regex: word, $options:'i'}}]} , (err, foundSongs) => {
        //     if(err){
        //         console.log(err);
        //     } else {
        //         artist.find({$or:[{artist: {$regex: word, $options:'i'}}]} , (err, foundArtists) => {
        //         if(err){
        //             console.log(err);
        //         }else{
        //             res.render('search.ejs', {song: foundSongs, word: word, artist: foundArtists});
        //         }
        //         });
        //     }
        // });
        }
    });
});

router.get('/favorite' , middleware.isLoggedin, function(req,res){
    // console.log(req.user._id);
    user.findOne(req.user._id).populate("favorite").exec(function(err, fav) {
    if(err){
        console.log(err);
    }else{
        console.log(fav);
        res.render('liked.ejs', {user: fav});
    }
  });
});

router.get('/artist/:artist', middleware.isLoggedin, function(req,res){
    // res.render('artist.ejs');

    song.find({artist:req.params.artist}).sort({listen: -1}).limit(4).exec(function(err, foundArtist){
        if(err){
            console.log(err);
        }else{
            artist.findOne({artist:req.params.artist}, (err,foundName) =>{
                if(err){
                    console.log(err);
                } else {
                    album.find({artist:req.params.artist}, function(err,foundAlbum){
                        res.render('artist.ejs', {song: foundArtist,artist:foundName ,album: foundAlbum});
                    })
                    // console.log(foundName);
                    
                }
            });
            // console.log(foundArtist);
        }
    });

});

router.get('/goAlbum/:name', middleware.isLoggedin, function(req,res){
    
    album.findOne({name:req.params.name}, function(err, foundArtist){
        if(err){
            console.log(err);
        }else{
            
            console.log(req.params.name);
            song.find({album:req.params.name},function(err, foundName){
                if(err){
                    console.log(err);
                } else {
                    res.render('goAlbum.ejs', {album: foundArtist,song:foundName});
                }
            });
      
        }
    });

});


router.get('/category/:category', middleware.isLoggedin, function(req,res){
    // res.render('artist.ejs');

    song.find({category:req.params.category}, function(err, foundCate){
        if(err){
            console.log(err);
        }else{
            console.log(foundCate);
            res.render('category.ejs', {song: foundCate});
            // console.log(foundArtist);
        }
    });

});

router.post('/search',middleware.isLoggedin,function(req,res){
    const word = req.body.search;
    song.find({$or:[{name: {$regex: word, $options:'i'}}]} , (err, foundSongs) => {
        if(err){
            console.log(err);
        } else {
            artist.find({$or:[{artist: {$regex: word, $options:'i'}}]} , (err, foundArtists) => {
                if(err){
                    console.log(err);
                }else{
                    res.render('search.ejs', {song: foundSongs, word: word, artist: foundArtists});
                }
            });
        }
    });
});



module.exports = router;