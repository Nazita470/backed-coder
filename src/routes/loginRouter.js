import { Router } from "express";
import userModel from "../dao/models/userModel.js";
import express from "express"

const loginRouter = new Router()
loginRouter.use(express.json())

const emailAdmin = "adminCoder@coder.com"
const passwordAdmin = "adminCod3r123"

loginRouter.post("/register", async (req, res) => {
    const {name, last_name, email, age, password} = req.body
    let rol = "usuario"
    
    if(email == emailAdmin && password == passwordAdmin){
        rol = "admin"
    }
    const exists = await userModel.findOne({email: email})
    console.log(exists)
    if(exists) return res.status(400).send({status: "error", message: "Email ya existente"})
    
    const user = {
        name, 
        last_name, 
        email,
        age, 
        password,
        rol
    }
   

    await userModel.create(user)
    res.send({status: "success", message: "User created"})
})

loginRouter.post("/login",async (req, res) => {
    const {email, password} = req.body
  
    const user = await userModel.findOne({email, password})
    console.log(user)
    if(!user) return res.status(400).send({status: "error", message: "user not found"})

    req.session.user = {
        name: `${user.name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }

    res.send({status: "success", message: "Sesion initialized"})
})

loginRouter.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if(!err) res.send({status: "sucess", message: "Logout ok!"})
        else res.send({status: "error", body: err})
    })
})

export default loginRouter