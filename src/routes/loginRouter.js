import { Router } from "express";
import userModel from "../dao/models/userModel.js";
import express from "express"
import passport from "passport";
import { passportCall } from "../config/passport.error.js";
import UserDTO from "../dao/DTOs/user.dto.js";

const loginRouter = new Router()
const userDTO = new UserDTO()
loginRouter.use(express.json())

loginRouter.get("/github", passport.authenticate("github", {scope: ["user: email"]}), async (req, res) => {})

loginRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user
    res.redirect("/products")
})

loginRouter.post("/register", passportCall("register") , async (req, res) => {
    res.send({status: "sucess", message:"User registered"})
})

loginRouter.post("/login", passportCall("login"), async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Invalid credentials"})
    console.log(req.user)
    req.session.user = req.user
    res.send({status: "sucess", payload:req.user})
})

loginRouter.get("/faillogin", (req, res) => {
    console.log("Error al validar")
    res.send({status: "error", message: "Passaport error"})
})


loginRouter.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if(!err) res.send({status: "sucess", message: "Logout ok!"})
        else res.send({status: "error", body: err})
    })
})

export default loginRouter