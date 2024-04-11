import { Router } from "express";
import fs, { readFile } from "fs"
import {v4 as uuidv4} from "uuid"
import express from "express"
import { leerArchivo } from "../utils.js"
import { validarProducto } from "../utils.js";
import { escribirArchivo } from "../utils.js";
import ProductsManager from "../dao/services/productManager.js";
import productsModel from "../dao/models/productsM.js";
import { armarUrl } from "./viewsRouter.js";

const products_router = Router()
const products_path = "base/products.json"
const productsManager = new ProductsManager()

const products = await leerArchivo(products_path)
products_router.use(express.json())
products_router.use(express.urlencoded({extended:true}))

products_router.get("/", async (req, res) => {
    let page = req.query.page
    let limit = req.query.limit
    let lastquery = req.query.query
    let query = lastquery ? JSON.parse(lastquery) : {}
    //console.log(query)
    let sort = req.query.sort
    let urlParams = armarUrl(limit, lastquery, sort) 
    if(!page) page = 1
    if(!limit) limit = 10
    if(!query) query = {}
    if(!sort) sort = null
    //console.log(req.query.limit)
    const obj = {
        page: page,
        limit: limit,
        query: query,
        sort: sort
    }
    productsManager.getByPage(obj)
    .then(result => {
         result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}${urlParams}`: null
         result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}${urlParams}` : null
        // console.log(result)
         res.send(result)
    })
    
   //console.log(products)
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

