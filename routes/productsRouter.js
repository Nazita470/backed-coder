import { Router } from "express";
import fs, { readFile } from "fs"
import {v4 as uuidv4} from "uuid"
import express from "express"
import { leerArchivo } from "../utils.js"
import { validarProducto } from "../utils.js";
import { escribirArchivo } from "../utils.js";

const products_router = Router()
const products_path = "./base/products.json"

const products = await leerArchivo(products_path)

products_router.use(express.json())
products_router.use(express.urlencoded({extended:true}))

products_router.get("/", (req, res) => {
    const limit = req.query.limit
    limit ? res.send(products.slice(0, limit)) : res.send({products})
})

products_router.get("/:pid", (req, res) => {
    const id = req.params.pid
    const p = products.find(p => p.id == id)

    if(!p) return res.status(404).send({status: "error", error:"User not found"})
    res.json(p)
})

products_router.post("/", (req, res) => {
    const id = uuidv4()
    const dataProduct = req.body
    const status = {status: true}
    if(!validarProducto(dataProduct)) return res.status(400).send({status: "error", message: "incompleted products"})
    if(req.body?.status == false) status.status = false
    const newProducts = {
       id: id,
       ...dataProduct,
       ...status
    }

    products.push(newProducts)

    escribirArchivo(products_path, products)
    res.send({status: "success", message: "User created"})
})

products_router.put("/:pid", (req, res) => {
    const id  = req.params.pid
    const change = req.body
    const index = products.findIndex(p => p.id == id)
    if(change.id) return res.status(400).send({status: "error", message: "Wrong information"})
    if(index == -1) return res.status(404).send({status: "error", message:"User not found"})

    const newP = {
        ...products[index],
        ...change,
    }

    console.log(newP)
    products[index] = newP
    escribirArchivo(products_path, products)
    res.send({status: "seccess", message:"Producto modificado"})
})

products_router.delete("/:pid", (req, res) => {
    const id = req.params.pid
    const find = products.find(p => p.id == id)
    if(!find) return res.status(404).send({status: "error", message:"User not found"})
    const deletedProduct = products.filter(p => p.id != id)
    escribirArchivo(products_path, deletedProduct)
    res.send({status: "seccess", message: "User delete"})
})  

export default products_router

