import { Router } from "express";
import CartManager from "../dao/services/cartManager.js";

const cartViewRouter = new Router()
const cartManager = new CartManager()

cartViewRouter.get("/:cid", (req, res) => {
    const { cid } = req.params
    cartManager.getCartByPopulate(cid)
    .then(result => {
        
         res.render("cart", {productos: result[0].products, id:result[0]._id})
    })
    
    
})
export default cartViewRouter