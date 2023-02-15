const db = require("../database/models")


function loggedViewMiddle (req,res,next ){
    res.locals.logged = false;
    if(req.cookies.emailUsuario){
    let idInCookie = req.cookies.idUser
    let userFromCookie = db.user.findByPk(idInCookie)
    if(userFromCookie){
        req.session.userLogged = userFromCookie;
    }
    }
    if(req.session && req.session.userLogged)
    {   
        //console.log('entre al if' + req.session.userLogged) esto devuelve object object ?? 
        res.locals.logged = true;
        //console.log(res.locals.logged);
    }
    next();
}

module.exports =  loggedViewMiddle