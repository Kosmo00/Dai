module.exports = {

    isLoggedIn(req, res, next){
        if(req.authenticated){
            return next();
        }
        return res.redirect ('/signin');
    },


    isNotLoggedIn(req, res, next){
        console.log(req.authenticated);
        if(!req.authenticated){
            return next();
        } 
        return res.redirect('/profile');
    }
};


