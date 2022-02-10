const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    user = require('./models/user'),
    song = require('./models/song'),
    seedDB = require('./seeds'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    flash = require('connect-flash'),
    methodOverride = require('method-override');

var indexRoutes = require('./routes/index'),
    soulcastRoutes = require('./routes/soulcast');
    adminRoutes = require('./routes/admin');

mongoose.connect('mongodb://localhost/Soulcast');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(flash());
// seedDB();

app.use(require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use('/', indexRoutes);
app.use('/soulcast', soulcastRoutes);
app.use('/admin', adminRoutes);


app.listen(3000, function(req,res){
    console.log("sever is running");
});