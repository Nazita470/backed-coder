export function authLogin(req, res, next) {
    if(!req.session || !req.session.user) {
         return res.send("Not authorized")
    }

    next()
}

export function notLogin(req, res, next) {
    if(req.session.user) {
        console.log(req.session.user)
        return res.redirect("/profile")
   }

   next()
}