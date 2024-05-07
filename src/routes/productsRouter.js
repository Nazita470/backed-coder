import { Router } from "express";
import express from "express"
import { leerArchivo } from "../utils.js"
import ProductController from "../controllers/productControler.js";

const products_router = Router()
const products_path = "base/products.json"
const productController = new ProductController()

const products = await leerArchivo(products_path)
products_router.use(express.json())
products_router.use(express.urlencoded({extended:true}))

products_router.get("/", productController.getProducts)

products_router.get("/:pid", productController.getById)

products_router.post("/", productController.createProduct)

products_router.put("/:pid", productController.updateProduct)

products_router.delete("/:pid", productController.deleteProduct)  

export default products_router

