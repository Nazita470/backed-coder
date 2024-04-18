import passport from "passport";
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import userModel from "../dao/models/userModel.js"
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy
const initializePassport = () => {
    const emailAdmin = "adminCoder@coder.com"
    const passwordAdmin = "adminCod3r123"

    passport.use("github", new GitHubStrategy(
        {
            clientID:"Iv1.a51a5bf684cde45b",
            clientSecret: "8bfcfffbcbf39389407ab0987428b24dea315287",
            scope: ['user:email'],
            callbackURL:"http://localhost:8080/api/session/githubcallback"
        }
        , async (accessToken, refreshToken,profile, done) => {
           try{
                let user = await userModel.findOne({email: profile._json.email})
                if(user) { console.log("usuario ya existente"); return done(null, user) }// El usuario ya existe
                
                let newUser = {
                    name: profile._json.name,
                    last_name:"",
                    age: null,
                    email:profile._json.email,
                    password: ""
                }

                let result = await userModel.create(newUser)
                done(null, result)
                
            } catch (error) {
                console.log(error)
                done(error)
            }
        })
    )

   // passport.use("register", new LocalStrategy())
    
   passport.use("register", new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (req, username, password, done) => {
            console.log("logear")
            
            const {name, last_name, age} = req.body
            console.log("entro")
            let rol = "usuario"
            console.log("user created")
            if(username == emailAdmin && password == passwordAdmin){
                rol = "admin"
            }
            try {
                let user = await userModel.findOne({email: username})
                if(user) return done(null, false)
                const newUser = {
                        name, 
                        last_name, 
                        email: username,
                        age, 
                        password: createHash(password),
                        rol
                    
                }

                let result = await userModel.create(newUser)
                return done(null, result)
            }catch(error) {
                return done("Error al obtener el usuario: " + error)
            }
            
        }
    ))
    
    passport.use("login", new local.Strategy(
        {usernameField: "email"},
        async (username, password, done) => {
            try{
                const user = await userModel.findOne({email : username})
    
                if(!user) return done(null, false)
                if(!isValidPassword(user, password)) return done(null, false)
                return done(null, user)
            }catch(error) {
                return done("Error al buscar el usuario: " + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport