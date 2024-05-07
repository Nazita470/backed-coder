import productsModel from "../models/productsM.js";
import { validarProducto } from "../../utils.js";
import { leerArchivo } from "../../utils.js";

class ProductsManager {
    getAll = async (limit) => {
        let products
        if(limit) {
             products = await productsModel.find().limit(limit)
        }else {
            products = await productsModel.find()
        }
       
        return products
    }

    getByPage = async (objeto) => {
        const {page, query, limit, sort} = objeto
        console.log("sort", sort)
        let newSort 
        if(sort) {
            if(sort == "asc"){
                newSort = { price: 1 }
            }else if(sort == "desc") {
                newSort = {price: -1}
            }else {
                newSort = {}
            }
        }else {
            newSort = {}
        }

        console.log(newSort)
        
        let products = await productsModel.paginate(query, {page, limit:limit, lean: true , sort: newSort})
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
             return {status: 1, payload: p}
        }else {
            console.log("Usuario incompleto")
            return {status: 0, payload: "Usuario incompleto"}
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

export class ProductsFyleManager {
    products = 0
    productsPath = "../../../base/products.json"

    constructor() {
        leerArchivo(this.productsPath).then(result => products = result)
    }
    
    getProdcuts = async (limit) => {
        if(limit)return(this.products.slice(0, limit))
        return(this.products)
    }

    getProductsById = async (id) => {
        const p = this.products.find(p => p.id == id)

        if(!p) return "Error"
        return p
    }

    addProduct = async (dataProduct) => {
        const id = uuidv4()
        const status = {status: true}
        if(!validarProducto(dataProduct)) return "Incompleted product"
        if(dataProduct.status == false) status.status = false
        const newProducts = {
           id: id,
           ...dataProduct,
           ...status
        }
    
        products.push(newProducts)
    
        escribirArchivo(products_path, products)
    }

    updateProducts = async (id, change) => {
        const index = products.findIndex(p => p.id == id)
        if(change.id) return  "Wrong information"
        if(index == -1) return "User not found"
    
        const newP = {
            ...products[index],
            ...change,
        }
    
        products[index] = newP
        escribirArchivo(products_path, products)
    }

    deleteProduct = async (id) => {
        const find = products.find(p => p.id == id)
        if(!find) return "User not found"
        const deletedProduct = products.filter(p => p.id != id)
        escribirArchivo(products_path, deletedProduct)
    }
}

export default ProductsManager