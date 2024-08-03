import { Router } from "express";
import { userRepositories } from "../repositories/index.js";
import { authLogin, isAdmin } from "../middlewars.js";
const userRouter = new Router()
import { uploader } from "../utils/multer/multer.js";

function validarUsuarioToPremium(user) {
    const documents = user.documents
    if(documents.some(item => item.name.includes("Identificacion")) ) {
        if(documents.some(item => item.name.includes("ComprobanteDomicilio"))) {
            if(documents.some(item => item.name.includes("ComprobanteCuenta"))) {
                return true
            }
        }
    }

    return false
}

function compararFechasDias(fecha) {
    const actualDate = new Date()
    const days_diference = (actualDate.getTime() - fecha.getTime()) / 86400000 
    return days_diference
}

userRouter.get("/", async (req, res) => {
    const users = await userRepositories.getAllUserToFront()
    res.send({status: "sucess", payload: users})
})

userRouter.delete("/",authLogin , isAdmin, async (req, res) => {
    //Milisegunso por dia 86400000
    //Milisegundos por hora 3600000
    //Milisegundos por minuto 60000
    //Milisegunso por segundo 1000
    const users = await userRepositories.getAllUser()
    const deletedUser = []
    users.forEach(async (user) => {
        const days = compararFechasDias(user.last_connection)
        if(days >= 2) {
            deletedUser.push(user._id)
            await userRepositories.deteleUser(user._id)
        }
    })
    
    res.send({status: "sucess", message: "Users without use are deleted"})
})

userRouter.delete("/:uid", async (req, res) => {
    const uid = req.params.uid
    const result = await userRepositories.deteleUser(uid)
    res.send({status: "sucess", message: `User ${uid} deleted`})
})

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
       return res.send({status: "error", message: "You cant change admin role"})
    }
    const result = await userRepositories.updateUser(user.email, user)
    res.send({status: "sucess", message: "User updated"})
})

userRouter.post("/:uid/documents" ,uploader.fields([{name: "profile"}, {name: "products"}, {name: "documents"}]) ,async (req, res) => {
   const uid = req.params.uid
   
   const user = await userRepositories.getUserByID(uid)
   if(!user) {
    return  res.send({status: "error", message: "User doesnt exist"})
  }
   const archivos = req.files
   const newArchivos = user.documents
   if(archivos?.profile) {
        archivos.profile.map((item) => {
            const newDocument = {
                name: item.originalname,
                reference: item.destination + `/${item.originalname}`
            }
            newArchivos.push(newDocument)
        })
   }

    if(archivos?.products) {
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