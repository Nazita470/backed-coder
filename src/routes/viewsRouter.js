import { Router } from "express";
import ProductsManager from "../dao/services/productManager.js";
import CartManager from "../dao/services/cartManager.js";
import { authLogin, notLogin, rolUser } from "../middlewars.js";
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

viewRouter.get("/cart/:cid", authLogin, (req, res) => {
    const { cid } = req.params
    cartManager.getCartByPopulate(cid)
    .then(result => {
        
         res.render("cart", {productos: result[0].products, id:result[0]._id})
    })
    
    
})

viewRouter.get("/chat", authLogin,rolUser, async (req, res) => {
    res.render("chat")
})

viewRouter.get("/products", authLogin, (req, res) => {
    let page = req.query.page
    let limit = req.query.limit
    let lastquery = req.query.query
    let query = lastquery ? JSON.parse(lastquery) : {}
    let sort = req.query.sort
    let urlParams = armarUrl(limit, lastquery, sort)
    if(!page) page = 1
    if(!limit) limit = 10
    if(!query) query = {}
    if(!sort) sort = "desc"

    const obj = {
        page: page,
        limit: limit,
        query: query,
        sort: sort
    }
    productManager.getByPage(obj)
    .then(result => {
         result.isValid = page >= 1 && page <= result.totalPages
         result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}${urlParams}`: null
         result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}${urlParams}` : null
         if(req.session.user) {
            result.hasUser = true
            result.isUsuario = req.session.user.rol == "usuario"
            result.isAdmin = req.session.user.rol == "admin"
            result.user = req.session.user
         } else {
            result.hasUser = false
         }

         console.log(result)
         
    
         res.render("products", result)
    })
    
    
})

viewRouter.get("/login", notLogin ,(req, res) => {
    res.render("login")
})

viewRouter.get("/register", notLogin, (req, res) => {
    res.render("register")
})

viewRouter.get("/current", authLogin, (req, res) => {
    res.render("profile",{user: req.session.user} )
})

viewRouter.get("/register/correct", (req, res) => {
    

    let error = req.query.error || false
    let message = req.query.message
    if(!message) message = "Error en el registro"
    res.render("goodRegister", {error: error, isCorrect: !error, msj: message})
})

viewRouter.get("/login/error", (req, res) =>{
    let message = req.query.message
    if(!message) message = "Error en el login"
    res.render("badLogin", {msj: message})
})
export default viewRouter