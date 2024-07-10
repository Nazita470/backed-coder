import { Router } from "express";
import { userRepositories } from "../repositories/index.js";
const userRouter = new Router()
import { uploader } from "../utils/multer/multer.js";

function validarUsuarioToPremium(user) {
    const documents = user.documents
    if(documents.some(item => item.name.includes("Identificacion")) ) {
        console.log("Identificacion: Bien")
        if(documents.some(item => item.name.includes("ComprobanteDomicilio"))) {
            console.log("Domicilio: Bien")
            if(documents.some(item => item.name.includes("ComprobanteCuenta"))) {
                return true
            }
        }
    }

    return false
}
userRouter.post("/premium/:uid", async (req, res) => {
    const id = req.params.uid
    const user = await userRepositories.getUserByID(id)
    if(!user) {
      return  res.send({status: "error", message: "User doesnt exist"})
    }
    if(user.rol == "premium") {
        user.rol = "usuario"
    } else if (user.rol == "usuario") {
        if(!validarUsuarioToPremium(user)) {
            return  res.send({status: "error", message: "Documentacion no terminada"})
        }
        user.rol = "premium"
    } else if( user.rol == "admin") {
        res.send({status: "error", message: "You cant change admin role"})
    }
    console.log(user)
    const result = await userRepositories.updateUser(user.email, user)
    console.log(result)
    res.send({status: "sucess", message: "User updated"})
})

userRouter.post("/:uid/documents" ,uploader.fields([{name: "profile"}, {name: "products"}, {name: "documents"}]) ,async (req, res) => {
   const uid = req.params.uid
   
   const user = await userRepositories.getUserByID(uid)
   if(!user) {
    return  res.send({status: "error", message: "User doesnt exist"})
  }
   const archivos = req.files
   console.log(archivos)
   const newArchivos = user.documents
   if(archivos.profile) {
        archivos.profile.map((item) => {
            const newDocument = {
                name: item.originalname,
                reference: item.destination + `/${item.originalname}`
            }
            newArchivos.push(newDocument)
        })
   }

    if(archivos.products) {
        archivos.products.map((item) => {
            const newDocument = {
                name: item.originalname,
                reference: item.destination + `/${item.originalname}`
            }
            newArchivos.push(newDocument)
        })
    }

    if(archivos.documents) {
        archivos.documents.map((item) => {
            const newDocument = {
                name: item.originalname,
                reference: item.destination + `/${item.originalname}`
            }
            newArchivos.push(newDocument)
        })
    }

  user.documents = newArchivos
  userRepositories.updateUser(user.email, user)
   res.send("sucess")
})

export default userRouter

//,uploader.fields([{name: "profile"}, {name: "products"}, {name: "documents"}])