import { Router } from "express";
import fs, { readFile } from "fs"
import {v4 as uuidv4} from "uuid"
import express from "express"
import { leerArchivo } from "../utils.js"
import { validarProducto } from "../utils.js";
import { escribirArchivo } from "../utils.js";
import ProductsManager from "../dao/services/productManager.js";

const products_router = Router()
const products_path = "base/products.json"
const productsManager = new ProductsManager()

const products = await leerArchivo(products_path)
products_router.use(express.json())
products_router.use(express.urlencoded({extended:true}))

products_router.get("/", (req, res) => {
    const limit = req.query.limit
    //limit ? res.send(products.slice(0, limit)) : res.send({products})
    productsManager.getAll(limit)
    .then((p) => res.send(p))
    //console.log(products)
    //res.send({products})
})

products_router.get("/:pid", (req, res) => {
    const id = req.params.pid
    productsManager.getById(id)
    .then((p) => {
        if(p) {
            res.send(p)
        }else {
            res.status(303).send({status: "error", message: "User not found"})
        }
    })
    //const p = products.find(p => p.id == id)
    //if(!p) return res.status(404).send({status: "error", error:"User not found"})
})

products_router.post("/", (req, res) => {
    //mongo 
    const dataProduct = req.body 
    const status = {status: true}
    if(req.body?.status == false) status.status = false
    const newProducts = {
       ...dataProduct,
       ...status
    }

    productsManager.addProducts(newProducts)

    //FileSystem
    products.push({newProducts})

    escribirArchivo(products_path, products)
    
    res.send({status: "sucess", message: "Product add"})
})

products_router.put("/:pid", (req, res) => {
    
    const id  = req.params.pid
    const change = req.body
    //MongoDB
    productsManager.updateProducts(id, change)
    //FileSystem
    const index = products.findIndex(p => p.id == id)
    if(change.id) return res.status(400).send({status: "error", message: "Wrong information"})
    //if(index == -1) return res.status(404).send({status: "error", message:"User not found"})
    const newP = {
        ...products[index],
        ...change,
    }
    products[index] = newP
    escribirArchivo(products_path, products)

    
    res.send({})
})

products_router.delete("/:pid", (req, res) => {
    const id = req.params.pid
    
    //Mongo

    const resultado = productsManager.deleteProducts(id)

    //FileSystem
    const find = products.find(p => p.id == id)
    console.log(find)
    if(find) {
        const deletedProduct = products.filter(p => p.id != id)
        escribirArchivo(products_path, deletedProduct)
    }
    res.send({})
})  

export default products_router

