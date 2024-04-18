import { Router } from "express";
import userModel from "../dao/models/userModel.js";
import express from "express"
import passport from "passport";

const loginRouter = new Router()
loginRouter.use(express.json())

const emailAdmin = "adminCoder@coder.com"
const passwordAdmin = "adminCod3r123"

loginRouter.get("/github", passport.authenticate("github", {scope: ["user: email"]}), async (req, res) => {})

loginRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user
    res.redirect("/products")
})

loginRouter.post("/register", passport.authenticate("register", {failureRedirect: "/failregister"}) , async (req, res) => {
    res.send({status: "sucess", message:"User registered"})
})

loginRouter.get("/failregister", (req, res) => {
    console.log("Failed strategy")
    res.send({error: "Failed"})
})

loginRouter.post("/login", passport.authenticate("login", {failureRedirect: "/faillogin"}), async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Invalid credentials"})
    req.session.user = {
        name: `${req.user.name} ${req.user.last_name}`,
        age:req.user.age,
        email: req.user.email
    }
    res.send({status: "sucess", payload:req.user})
})

loginRouter.get("/faillogin", (req, res) => {
    console.log("Error al validar")
    res.send({status: "error", message: "Passaport error"})
})


/*
loginRouter.post("/register", async (req, res) => {
    const {name, last_name, email, age, password} = req.body
    let rol = "usuario"
    
    if(email == emailAdmin && password == passwordAdmin){
        rol = "admin"
    }
    const exists = await userModel.findOne({email: email})
    if(exists) return res.status(400).send({status: "error", message: "Email ya existente"})
    if(!email) return res.status(400).send({status: "error", message: "NO ingreso email"})
    const user = {
        name, 
        last_name, 
        email,
        age, 
        password,
        rol
    }
   

    await userModel.create(user)
    console.log("Usuario registrado")
    res.send({status: "success", message: "User created"})
})

loginRouter.post("/login",async (req, res) => {
    const {email, password} = req.body
  
    const user = await userModel.findOne({email, password})
    if(!user) {
        console.log("Usuario no encontrado")
        return res.status(400).send({status: "error", message: "user not found"}) 
    }

    req.session.user = {
        name: `${user.name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }
    console.log("Session iniciada")
    res.send({status: "success", message: "Sesion initialized"})
}) 
*/

loginRouter.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if(!err) res.send({status: "sucess", message: "Logout ok!"})
        else res.send({status: "error", body: err})
    })
})

export default loginRouter