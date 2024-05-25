import { armarUrl } from "../routes/viewsRouter.js";
import { productRepositories } from "../repositories/index.js";

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

    getById = async (req, res) => {
        const id = req.params.pid
        const product = await productRepositories.getById(id)
        if(!product) res.status(303).send({status: "error", message: "Product not found"})
        res.send(product)
                
    }
        
    createProduct = async (req, res) => {
        const dataProduct = req.body 
        const status = {status: true}
        if(req.body?.status == false) status.status = false
        const newProducts = {
        ...dataProduct,
        ...status
        }

        const result = await productRepositories.addProducts(newProducts)
        if(result.status == 0) {
             res.send({status: "error", message: result.payload})
        }else {
            res.send({status: "success", message: "Product created"})
        }
    } 

    updateProduct = async (req, res) => {
        const id  = req.params.pid
        const change = req.body
        productRepositories.updateProducts(id, change)
        res.send({status: "sucess", message: `user ${id} updated`})
    }

    deleteProduct = async (req, res) => {
        const id = req.params.pid
    
        const resultado = await productRepositories.deleteProducts(id)
        res.send({status: "sucess", message: `user ${id} deleted`})
    }
    
}

export default ProductController

//api/products/65f5e3ad560c647b56f2b41e