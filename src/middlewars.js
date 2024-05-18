export function authLogin(req, res, next) {
    if(!req.session || !req.session.user) {
         return res.send("Not authorized")
    }
    console.log(req.session.user)
    next()
}

export function notLogin(req, res, next) {
    if(req.session.user) {
        console.log(req.session.user)
        return res.redirect("/current")
   }

   next()
}

export function rolUser(req, res, next){
    if(req.session.user.rol == "usuario") {
        next()
    }else{    
        res.status(403).send({status: "error", message: "Not authorized"})
    }
    
}

export function isAdmin(req, res, next) {
    if(req.session.user.rol != "admin") {
         res.status(403).send({status: "error", message: "Not authorized"})
    }else {
        next()
    } 
}