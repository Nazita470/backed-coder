import { Router } from "express";
import { authLogin, isAdmin, notLogin, rolUser } from "../middlewars.js";
import { cartRepositories, userRepositories } from "../repositories/index.js";
import { productRepositories } from "../repositories/index.js";
import { ticketRepositories } from "../repositories/index.js";
import CostumError from "../utils/errors/customError.js";
import ERROR_TYPES
 from "../utils/errors/enums.js";
import userModel from "../dao/models/userModel.js";
const viewRouter = new Router()


export function armarUrl(limit, query, sort){
    let result = ""
    if(limit) {
        result += `&&limit=${limit}`
    }
    if(query) result += `&&query=${query}`
    if(sort) result += `&&sort=${sort}`

    return result
}


viewRouter.get("/cart/:cid", async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartRepositories.getCartByPopulate(cid)
        if(!cart) {
            throw CostumError.createError({
                name: "Cart nout found",
                cause: "Invalid id",
                message: "Error searching for cart",
                code: ERROR_TYPES.ERROR_DATA
            })
        }
        res.render("cart", {productos: cart[0].products, id:cart[0]._id})
    } catch (error) {
        req.logger.error(error)
    }
   
    
    
    
})

viewRouter.get("/chat", authLogin,rolUser, (req, res) => {
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
    productRepositories.getByPage(obj)
    .then(result => {
         result.isValid = page >= 1 && page <= result.totalPages
         result.nextLink = result.hasNextPage ? `https://backed-coder-production-1cd6.up.railway.app/?page=${result.nextPage}${urlParams}`: null
         result.prevLink = result.hasPrevPage ? `https://backed-coder-production-1cd6.up.railway.app/?page=${result.prevPage}${urlParams}` : null
         if(req.session.user) {
            result.hasUser = true
            result.isUsuario = req.session.user.rol == "usuario" || req.session.user.rol == "premium"
            result.isAdmin = req.session.user.rol == "admin"
            result.user = req.session.user
         } else {
            result.hasUser = false
         }

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


viewRouter.get("/restore/password", authLogin,  (req, res) => {
    if(req.cookies?.email) {
       return res.render("restorePassword")
    }

    res.render("restorePasswordTime")
})

viewRouter.get("/users", authLogin, isAdmin , async (req, res) => {
    const users = await userRepositories.getAllUser()
    res.render("users", {users: users})
})

viewRouter.get("/ticket/:tid", authLogin, async (req, res) => {
    const tid = req.params.tid
    const ticket = await ticketRepositories.getByCode(tid)
    if(!ticket) return res.status(404).send({status: "error", message: "Ticket doesnt exists"})
    res.render("ticket", ticket[0])
})

export default viewRouter