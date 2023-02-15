const db = require("../database/models")


function adminMiddle (req,res,next ){
    res.locals.admin = false;
    if(req.session.userLogged){
        if(req.session.userLogged.rol_id == 1){
            res.locals.admin = true;
        }
    }
    next();
}

module.exports =  adminMiddle