import { Router } from "express";
import userModel from "../dao/models/userModel.js";
import express from "express"
import passport from "passport";

const loginRouter = new Router()
loginRouter.use(express.json())


loginRouter.get("github")

loginRouter.post("/register", passport.authenticate("register",
    {failureRedirect: "/failregister"}) ,async (req, res) => {
    res.send({status: "sucess", message: "User registered"})
})

loginRouter.get("/failregister", (req, res) => {
    console.log("Failed strategy")
    res.send({error: "Failed"})
})


loginRouter.post("/login", passport.authenticate("login", {
    failureRedirect: "/faillogin"
}),async (req, res) => {
    console.log("Hola")
    req.session.user = req.user
    res.status(200).send({status: "success", message: "Sesion initialized"})
})

loginRouter.get("/faillogin", (req, res) => {
    console.log("Error al validar")
    res.send({status: "error", message: "Passaport error"})
})

loginRouter.get("/github", passport.authenticate("github", {scope: ["user: email"]}))

loginRouter.get("/githubcallback", passport.authenticate("github",  {failureRedirect: "login"}), (req, res) => {
    req.session.user = req.user
    res.redirect("/products")
})

loginRouter.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if(!err) res.send({status: "sucess", message: "Logout ok!"})
        else res.send({status: "error", body: err})
    })
})

export default loginRouter