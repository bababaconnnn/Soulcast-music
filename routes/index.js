var express = require('express'),
    router = express.Router(),
    user = require('../models/user'),
    passport = require('passport'),
    multer = require('multer'),
    middleware = require('../middleware/middle'),
    path = require('path'),
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

router.get('/', function(req,res){
    res.render('home.ejs');
});

// here
router.post('/signup', function(req,res){
    var newUser = new user({firstname:req.body.firstname,
                            lastname:req.body.lastname,
                            username:req.body.username,
                            email:req.body.email,
                            Bday:req.body.Bday,
                            Bmonth:req.body.Bmonth,
                            Byear:req.body.Byear});
    user.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log("signup unsuccessful");
            req.flash('error','Username is already registered');
            res.redirect('/signup/new');
            throw err;
        }
        passport.authenticate('local')(req,res,function(){
        req.flash('success','Signup Successful');
        res.redirect('/soulcast');
        console.log("signup successful");
        }); 
    });
});

router.get('/signup/new', function(req,res){
    res.render('signup.ejs');
});

router.get('/login',function(req,res){
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local',{
    // successRedirect: '/soulcast',
    failureRedirect: '/login',
    successFlash: true,
    failureFlash: true,
    failureFlash: 'Invalid username or password.'
}),function(req,res){
    if(req.user.role === 'Admin' || req.user.role === 'Master Admin'){
        req.flash('success','Welcome! Admin');
        res.redirect('/admin/edit');
    }else{
        req.flash('success','Welcome! to Soulcast');
        res.redirect('/soulcast');
    }
});

// router.post('/login',requireAdmin(), passport.authenticate('local'),function(req,res){
//     // var admin = new user({role:});
//     // if(user.role)
// });

// function requireAdmin() {
//     return function(req, res, next) {
//       user.find(function(err, user) {
//         console.log(user);
//         if (err) { return next(err); }
  
//         if (user.exists({role: 'admin'})) { 
//           res.redirect('/admin/add');
//           return;
//         }
//         // Hand over control to passport
//         next();
//       });
//     }
//   }

router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

router.get('/premium', function(req,res){
    res.render('premium.ejs');
});

// router.get('/premium/pay', function(req,res){
//     res.render('payPremium.ejs');
// });

router.get('/user/:id',middleware.isLoggedin, function(req,res){
    user.findById(req.params.id, function(err,foundUser){
        if(err){
            req.flash('error','There is something wrong');
            return res.redirect('/');
        }else{
            user.findOne(req.user._id).populate("follow").exec(function(err, follow) {
                if(err){
                    console.log(err);
                }else{
                    console.log(follow);
                    res.render('showUser.ejs', {user:foundUser , artist:follow});
                }
              });
            
        }
    });
});
router.post('/edit/profile/:id', upload.single('profileImage'),middleware.isLoggedin,function(req,res){
    if(req.file){
        req.body.update.profileImage = '/uploads/' + req.file.filename;
    }
    user.findByIdAndUpdate(req.params.id, req.body.update, function(err, updateSong){
        if(err){
            console.log(err);
            req.flash('error','Can not Update Profile');
        } else{
            req.flash('success', 'Update Profile Successful');
            res.redirect('/user/'+ req.params.id);
        }
    })
});

// function isLoggedin(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect('/login');
// }

module.exports = router;