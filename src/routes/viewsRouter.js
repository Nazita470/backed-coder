import { Router } from "express";
import ProductsManager from "../dao/services/productManager.js";
import CartManager from "../dao/services/cartManager.js";
import { authLogin, notLogin } from "../middlewars.js";
const viewRouter = new Router()
const cartManager = new CartManager()
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

viewRouter.get("/cart/:cid", (req, res) => {
    const { cid } = req.params
    cartManager.getCartByPopulate(cid)
    .then(result => {
        
         res.render("cart", {productos: result[0].products, id:result[0]._id})
    })
    
    
})

viewRouter.get("/chat", async (req, res) => {
    res.render("chat")
})

viewRouter.get("/products", (req, res) => {
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
         if(req.session.user) {
            result.hasUser = true
            result.user = req.session.user
         } else {
            result.hasUser = false
         }
         
         //console.log(result)
         res.render("products", result)
    })
    
    
})

viewRouter.get("/login", notLogin ,(req, res) => {
    res.render("login")
})

viewRouter.get("/register", notLogin, (req, res) => {
    res.render("register")
})

viewRouter.get("/profile", authLogin, (req, res) => {
    res.render("profile",{user: req.session.user} )
})
export default viewRouter