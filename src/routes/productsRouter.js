import { Router } from "express";
import express from "express"
import ProductController from "../controllers/productControler.js";
import { authLogin, isAdmin } from "../middlewars.js";
const products_router = Router()
const productController = new ProductController()

products_router.use(express.json())
products_router.use(express.urlencoded({extended:true}))

products_router.get("/", productController.getProducts)

products_router.get("/:pid", productController.getById)

products_router.post("/", productController.createProduct)

products_router.put("/:pid",authLogin, isAdmin, productController.updateProduct)

products_router.delete("/:pid",authLogin, isAdmin, productController.deleteProduct)  


export default products_router

