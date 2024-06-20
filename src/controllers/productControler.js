import { armarUrl } from "../routes/viewsRouter.js";
import { productRepositories } from "../repositories/index.js";
import { validarProducto } from "../utils.js";
import CostumError from "../utils/errors/customError.js";
import ERROR_TYPES from "../utils/errors/enums.js";
import { generateProductErrorInfo } from "../utils/errors/info.js";
import messageModel from "../dao/models/messagesM.js";
class ProductController {
    getProducts = async (req, res) =>{
        
        let page = req.query.page
        let limit = req.query.limit
        let lastquery = req.query.query
        let query = lastquery ? JSON.parse(lastquery) : {}
        let sort = req.query.sort
        let urlParams = armarUrl(limit, lastquery, sort) 
        if(!page) page = 1
        if(!limit) limit = 10
        if(!query) query = {}
        if(!sort) sort = null
        const obj = {
            page: page,
            limit: limit,
            query: query,
            sort: sort
        }
            const result = await productRepositories.getByPage(obj)
            result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}${urlParams}`: null
            result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}${urlParams}` : null
            res.send(result)
    }

    getById =  async (req, res, next) => {
        try {
            const id = req.params.pid
            const product = await productRepositories.getById(id)
            if(!product) {
                 throw CostumError.createError({
                    name: "Product not exists",
                    cause: "Poduct id doesnt exist",
                    message: "Error creating Product",
                    code: ERROR_TYPES.ERROR_DATA
                })
            }

            res.send(product)
        } catch (error) {
            req.logger.error(error)
            next(error)
        }          
    }
        
    createProduct = async (req, res, next) => {
      try {
        
       const dataProduct = req.body 
        const status = {status: true}
        if(req.body?.status == false) status.status = false
        const newProducts = {
        ...dataProduct,
        ...status
        }

       if(!validarProducto(newProducts)) {
            throw CostumError.createError({
                name: "Product incompleted",
                cause: generateProductErrorInfo(newProducts),
                message: "Error creating product",
                code: ERROR_TYPES.ERROR_DATA
            })
        }

        if(req.session.user.rol == "premium"){
            newProducts.owner = req.session.user.email
        }else {
            newProducts.owner = "admin"
        }

        const result = await productRepositories.addProducts(newProducts)
       
        res.send({status: "sucess", message: "Product created"})
       
      } catch (error) {
        next(error)
      }
       
    } 

    updateProduct = async (req, res) => {
        const id  = req.params.pid
        const change = req.body
        const product = await productRepositories.getById(id)
        const owner = product[0].owner
        if(req.session.user.rol == "premium"){
            if(req.session.user.email != owner) {
                return res.status(403).send({status: "error", message:"If you are premium, you can only update your products"})
            }
        }
        productRepositories.updateProducts(id, change)
        res.send({status: "sucess", message: `user ${id} updated`})
    }

    deleteProduct = async (req, res) => {
        const id = req.params.pid
        const product = await productRepositories.getById(id)
        if(product.length == 0) return res.send({status: "error", message: "Product doesnt exist"})
        const owner = product[0].owner
        if(req.session.user.rol == "premium"){
            if(req.session.user.email != owner) {
                return res.send({status: "error", message:"If you are premium, you can only delete your products"})
            }
        }
        const resultado = await productRepositories.deleteProducts(id)
        res.send({status: "sucess", message: `user ${id} deleted`})
    
    
    }
}

export default ProductController

/*
    "title": "Coca",
    "description": "ifbhif",
    "code": "1",
    "price": 10,
    "stock": 5,
    "category": 4

     "email": "adminCoder@coder.com",
   "password": "adminCod3r123"
    
*/