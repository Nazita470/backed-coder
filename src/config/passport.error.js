import passport from "passport";

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if(err) return next(err)
            if(!user) {
                const error = {error: info.message ? info.message:info.toString()}
                console.log(error)
                return res.status(401).send(error)
            }
            req.user = user
            next()
        })(req, res, next);
    }
}