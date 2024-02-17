import { Router } from "express";
import { escribirArchivo, leerArchivo } from "../utils.js";
import { v4 as uuid4 } from "uuid"  
const cart_router = Router()
const cartPath = "./base/cart.json"
const carritos = await leerArchivo(cartPath)
const products = await leerArchivo("./base/products.json")

cart_router.use(express.urlencoded({extended:true}))

cart_router.post("/", (req, res) => {
    const newCart = {id: uuid4(), products: []}
    carritos.push(newCart)
    escribirArchivo(cartPath, carritos)
    res.send({state: "success", message:"Cart created"})
})

cart_router.get("/:cid", (req, res) => {
    const id = req.params.cid
    console.log(id)
    const cartFind = carritos.find(c => c.id == id)
    if(!cartFind) return res.status(404).send({status: "error", message:"Cart not found"})
    res.json(cartFind)
})

cart_router.post("/:cid/products/:pid", (req, res) => {
    const id = req.params.cid
    const productId = req.params.pid
    const cartIndex = carritos.findIndex(c => c.id == id)
    const pFind = products.find(p => p.id == productId)
    if(cartIndex == -1) return res.status(404).send({status: "error", message:"Cart not found"})
    if(!pFind) return res.status(404).send({status: "error", message:"Product not found"})
    
    const findIndexProduct = carritos[cartIndex].products.findIndex(p => p.product == productId)
    
    if(findIndexProduct != -1) {
        carritos[cartIndex].products[findIndexProduct].quantity += 1
    }
    
    else {
        carritos[cartIndex].products = [
            ...carritos[cartIndex].products, {
                product: productId,
                quantity: 1
            }
        ]
    }


    escribirArchivo(cartPath, carritos)
    res.send({status: "success", message: "Product added"})
})

export default cart_router