import productsModel from "../models/productsM.js";
import { validarProducto } from "../../utils.js";

export class ProductsManager {
    getAll = async (limit) => {
        let products
        if(limit) {
             products = await productsModel.find().limit(limit)
        }else {
            products = await productsModel.find()
        }
       
        return products
    }

    getById = async (id) => {
        try {
        const products = await productsModel.find({_id: id})
            return products
        }catch(error) {
            return false
        }
    }

    addProducts = async (prod) => {
        console.log(prod)
        if(validarProducto(prod)){
             const p = await productsModel.create(prod)
             return p
        }else {
            console.log("Usuario incompleto")
        }
    }

    updateProducts = async (id, prod) => {
        console.log(id)
        try {
         const p = await productsModel.updateOne({_id: id}, {$set: prod})
         return p 
        }catch(error) {
            console.error(error)
        }
    }

    deleteProducts = async (id) => {
        const p = await productsModel.deleteOne({_id:id})
    }

}

export default ProductsManager