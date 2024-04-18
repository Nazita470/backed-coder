import { Router } from "express";
import { escribirArchivo, leerArchivo } from "../utils.js";
import express from "express"
import { v4 as uuid4 } from "uuid"  
import CartManager from "../dao/services/cartManager.js";

const cart_router = Router()
const cartPath = "base/cart.json"
const carritos = await leerArchivo(cartPath)
const products = await leerArchivo(cartPath)
const cartManager = new CartManager()

cart_router.use(express.json())
cart_router.use(express.urlencoded({extended:true}))

cart_router.post("/", (req, res) => {
    //MOngo
    cartManager.createCart()

    //FileSystem
    const newCart = {id: uuid4(), products: []}
    carritos.push(newCart)
    escribirArchivo(cartPath, carritos)
    res.send({state: "success", message:"Cart created"})
})

cart_router.get("/:cid", (req, res) => {
    const id = req.params.cid

    //Mongo
    cartManager.getCartByPopulate(id).then(c => res.json(c))    

    //FileSystem
    const cartJsonFind = carritos.find(c => c.id == id)
    //if(!cartJsonFind) return res.status(404).send({status: "error", message:"Cart not found"})

})

cart_router.post("/:cid/products/:pid", (req, res) => {
    const id = req.params.cid
    const productId = req.params.pid

    //Mongo
    cartManager.addProducts(id, productId, 1)

    //FileSystem
    const cartIndex = carritos.findIndex(c => c.id == id)
    const pFind = products.find(p => p.id == productId)
    //if(cartIndex == -1) return res.status(404).send({status: "error", message:"Cart not found"})
    //(!pFind) return res.status(404).send({status: "error", message:"Product not found"})
    
    /*const findIndexProduct = carritos[cartIndex].products.findIndex(p => p.product == productId)
    
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


    escribirArchivo(cartPath, carritos)*/


    res.send({status: "success", message: "Product added"})
})

cart_router.delete("/:cid/products/:pid", (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    cartManager.deleteProduct(cid, pid)
    .then((result) => {
        result 
        ? 
        res.send({status: "sucess", message: "product eliminated"})
        :
        res.send({status: "error", message: "product not exists"})
    })
}) 

cart_router.put("/:cid", (req, res) => {
    const cid = req.params.cid
    const products = req.body
    cartManager.updateCart(cid, products)
    res.send({status: "sucess", message:  products})
})

cart_router.put("/:cid/products/:pid", (req, res) => {
   const {cid, pid} = req.params
   const q = req.body.quantity
   cartManager.updateProductQuantity(cid, pid, q)
   res.send({status: "sucess", message: "Quantity modificada"})
})

cart_router.delete("/:cid", (req, res) => {
    const cid = req.params.cid
    cartManager.deleteProductsCarts(cid)
    res.send({})
})

export default cart_router