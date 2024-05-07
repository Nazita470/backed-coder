import { Router } from "express";
import express from "express" 
import CartController from "../controllers/cartControler.js"

const cart_router = Router()
const cartController = new CartController()

cart_router.use(express.json())
cart_router.use(express.urlencoded({extended:true}))

cart_router.post("/", cartController.createCart)

cart_router.get("/:cid", cartController.getByIdPopulate)

cart_router.post("/:cid/products/:pid", cartController.addCartProduct)

cart_router.delete("/:cid/products/:pid", cartController.deleteCartProduct) 

cart_router.put("/:cid", cartController.updateCart)

cart_router.put("/:cid/products/:pid", cartController.updateCartProduct)

cart_router.delete("/:cid", cartController.deleteCart)

export default cart_router