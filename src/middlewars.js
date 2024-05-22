export function authLogin(req, res, next) {
    if(!req.session || !req.session.user) {
         return res.send("Not authorized, you have to login")
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
        res.status(403).send({status: "error", message: "Not authorized, you have to be usuario"})
    }
    
}

export function isAdmin(req, res, next) {
    if(req.session.user.rol != "admin") {
         res.status(403).send({status: "error", message: "Not authorized, you have to be admin"})
    }else {
        next()
    } 
}

export function isCart(req, res, next){
    const id = req.params.cid
    if(req.session.user.cart == id) return next()
    res.send({status: "error", message: "Not authorized, you can only add products to your cart"})
}