import { Router } from "express";
import ProductsManager from "../dao/services/productManager.js";

const productViewRouter = new Router()
const productManager = new ProductsManager()

export function armarUrl(limit, query, sort){
    let result = ""
    if(limit) {
        result += `&&limit=${limit}`
    }
    if(query) result += `&&query=${query}`
    if(sort) result += `&&sort=${sort}`

    return result
}

productViewRouter.get("/", (req, res) => {
    console.log(req.query)
    let page = req.query.page
    let limit = req.query.limit
    let lastquery = req.query.query
    let query = lastquery ? JSON.parse(lastquery) : {}
    console.log(query)
    let sort = req.query.sort
    let urlParams = armarUrl(limit, lastquery, sort)
    if(!page) page = 1
    if(!limit) limit = 10
    if(!query) query = {}
    if(!sort) sort = "desc"
    //console.log(req.query.query)
    const obj = {
        page: page,
        limit: limit,
        query: query,
        sort: sort
    }
    productManager.getByPage(obj)
    .then(result => {
         result.isValid = page >= 1 && page <= result.totalPages
         console.log(page)
         result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}${urlParams}`: null
         result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}${urlParams}` : null
         //console.log(result)
         res.render("products", result)
    })
    
    
})
export default productViewRouter

