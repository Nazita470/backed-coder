import { cartRepositories } from "../repositories/index.js";
import CostumError from "../utils/errors/customError.js";
import ERROR_TYPES from "../utils/errors/enums.js";
class CartController{
    createCart = async (req, res) => {
       
        const cart = await cartRepositories.createCart()
        res.send({status: "sucess", payload: cart})
    }

    getByIdPopulate = async (req, res, next) => {
        const id = req.params.cid

        try {
            const cart = await cartRepositories.getCartByPopulate(id)
            if(!cart) {
                throw CostumError.createError({
                    name: "Cart nout found",
                    cause: "Cart id is invalid",
                    message: "Error searching cart",
                    code: ERROR_TYPES.ERROR_DATA
                })
            }
            res.send(cart)
        } catch (error) {
            req.logger.error(error)
            next(error)
        }
       
        
       
        
       
    }

    addCartProduct = async (req, res, next) => {
        const id = req.params.cid
        const productId = req.params.pid

        try {
            const result = await cartRepositories.addProducts(id, productId, 1)
            if(result?.error) {
                throw CostumError.createError({
                    name: "Cart not found",
                    cause: "Invalid id",
                    message: "Error searching for cart",
                    code: ERROR_TYPES.ERROR_DATA
                })
            }
                  res.send({status: "sucesss", payload: result})
            
               
        } catch (error) {
            req.logger.error(error)
            next(error)
        }
       
        
    }

    deleteCartProduct = async (req, res) => {
        const cid = req.params.cid
        const pid = req.params.pid
    

        const result = await cartRepositories.deleteProduct(cid, pid)
        if(!result) return res.send({status: "error", message: "product not exists"}) 
        return res.send({status: "sucess", message: "product eliminated"})
    }
    

    updateCartProduct = async (req, res) => {
        const {cid, pid} = req.params
        const q = req.body.quantity
        cartRepositories.updateProductQuantity(cid, pid, q)
        res.send({status: "sucess", message: "Product modified"})
    }

    updateCart = async (req, res) => {
        const cid = req.params.cid
        const products = req.body
        const cart = await cartRepositories.updateCart(cid, products)
        res.send({status: "sucess", message:  cart})
    }

    deleteCart = async (req, res) => {
        const cid = req.params.cid
        cartRepositories.deleteProductsCarts(cid)
        res.send({status: "sucess", message: "cart eliminated"})
    }
}

export default CartController