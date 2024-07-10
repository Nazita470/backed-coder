import passport from "passport";
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import { createHash, isValidPassword } from "../utils.js";
import valores from "./env.config.js"
import { userRepositories } from "../repositories/index.js";

const LocalStrategy = local.Strategy
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
                let user = await userRepositories.getByEmail(profile._json.email)
                if(user) { console.log("usuario ya existente"); return done(null, user, {message: "El usuario ya exixte"}) }// El usuario ya existe
                
                let newUser = {
                    name: profile._json.name,
                    last_name:"",
                    age: null,
                    email:profile._json.email,
                    password: "",
                    rol: "usuario"
                }

                let result = await userRepositories.createUser(newUser)
                done(null, result, {message: "Usuario logeado correctamente"})
                
            } catch (error) {
                console.log(error)
                done(error)
            }
        })
    )

    
   passport.use("register", new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (req, username, password, done) => {
            const {name, last_name, age} = req.body
            let rol = "usuario"
            if(username == emailAdmin && password == passwordAdmin){
                rol = "admin"
            }
            try {
                let user = await userRepositories.getByEmail(username)
                if(user) return done(null, false, {message: "Usuario ya existente"})
                const newUser = {
                        name, 
                        last_name, 
                        email: username,
                        age, 
                        password: createHash(password),
                        rol,
                        last_connection: null
                    
                }

                let result = await userRepositories.createUser(newUser)
                return done(null, result)
            }catch(error) {
                console.log(error)
                return done("Error al obtener el usuario: " + error)
            }
            
        }
    ))
    
    passport.use("login", new local.Strategy(
        {usernameField: "email"},
        async (username, password, done) => {
            try{
                const prevUser = await userRepositories.getByEmail(username)
                if(!prevUser) return done(null, false, {message: "User doesnt exist"})
                //if(password != prevUser.password) return done(null, false, {message: "Incorrect password"})
                if(!isValidPassword(prevUser, password)) return done(null, false, {message: "Incorrect password"})
                const date = new Date()
                const fecha = date.toLocaleString('en-US', { timeZoneName: 'short' })
                prevUser.last_connection = fecha
                await userRepositories.updateUser(username, prevUser)
                const user = await userRepositories.getUserToFront(username)
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
        let user = await userRepositories.getUserByID(id)
        done(null, user)
    })
}

export default initializePassport