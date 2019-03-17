function authentication(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg',"Please Login To View This Content");
        res.redirect('/users/login');
    };

    module.exports={authentication};