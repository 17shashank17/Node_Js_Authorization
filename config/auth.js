module.exports={
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Please Login To Continue!');
        res.redirect('/user/login');
    }
}