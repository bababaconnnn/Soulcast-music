const song = require('../models/song');

var middlewareObj = {};

middlewareObj.isLoggedin = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
// middlewareObj.homeRedirect = function(req,res,next){
//     if(req.isAuthenticated()){
//         if(req.user.role === 'User' || req.user.role === 'Admin' || req.user.role === 'Master Admin'){
//             res.render('/');
//         }
//         next();
//     }
//     next();
// }

module.exports = middlewareObj;
