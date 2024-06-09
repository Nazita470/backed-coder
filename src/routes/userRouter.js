import { Router } from "express";
import { userRepositories } from "../repositories/index.js";
const userRouter = new Router()

userRouter.post("/premium/:uid", async (req, res) => {
    const id = req.params.uid
    const user = await userRepositories.getUserByID(id)
    if(!user) {
      return  res.send({status: "error", message: "User doesnt exist"})
    }
    if(user.rol == "premium") {
        user.rol = "usuario"
    } else if (user.rol == "usuario") {
        user.rol = "premium"
    } else if( user.rol == "admin") {
        res.send({status: "error", message: "You cant change admin role"})
    }
    console.log(user)
    const result = await userRepositories.updateUser(user.email, user)
    console.log(result)
    res.send({status: "sucess", message: "User updated"})
})

export default userRouter