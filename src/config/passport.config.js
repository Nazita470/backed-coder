import passport from "passport";
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import userModel from "../dao/models/userModel.js"
import { createHash, isValidPassword } from "../utils.js";
import UserManager from "../dao/services/userManager.js";
import valores from "./env.config.js"

const LocalStrategy = local.Strategy
const userManager = new UserManager()
const initializePassport = () => {
    const emailAdmin = valores.adminUser
    const passwordAdmin = valores.adminPassword

    passport.use("github", new GitHubStrategy(
        {
            clientID:"Iv1.a51a5bf684cde45b",
            clientSecret: "8bfcfffbcbf39389407ab0987428b24dea315287",
            scope: ['user:email'],
            callbackURL:"http://localhost:8080/api/session/githubcallback"
        }
        , async (accessToken, refreshToken,profile, done) => {
           try{
                let user = await userManager.getByEmail(profile._json.email)
                if(user) { console.log("usuario ya existente"); return done(null, user, {message: "El usuario ya exixte"}) }// El usuario ya existe
                
                let newUser = {
                    name: profile._json.name,
                    last_name:"",
                    age: null,
                    email:profile._json.email,
                    password: ""
                }

                let result = await userManager.create(newUser)
                done(null, result, {message: "Usuario logeado correctamente"})
                
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
            const {name, last_name, age} = req.body
            let rol = "usuario"
            if(username == emailAdmin && password == passwordAdmin){
                rol = "admin"
            }
            try {
                let user = await userManager.getByEmail(username)
                if(user) return done(null, false, {message: "Usuario ya existente"})
                const newUser = {
                        name, 
                        last_name, 
                        email: username,
                        age, 
                        password: createHash(password),
                        rol
                    
                }

                let result = await userManager.createUser(newUser)
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
                const user = await userManager.getByEmail(username)
    
                if(!user) return done(null, false, {message: "User doesnt exist"})
                if(!isValidPassword(user, password)) return done(null, false, {message: "Incorrect password"})
                return done(null, user, {message: "Log in"})
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