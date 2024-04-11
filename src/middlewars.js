export function authLogin(req, res, next) {
    if(!req.session || !req.session.user) {
         return res.redirect("/login")
    }

    next()
}

export function notLogin(req, res, next) {
    if(req.session.user) {
        return res.redirect("/profile")
   }

   next()
}