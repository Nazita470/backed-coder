import { cartRepositories } from "../repositories/index.js";
class CartController{
    createCart = async (req, res) => {
        const cart = await cartRepositories.createCart()
        res.send({status: "sucess", payload: cart})
    }
    getByIdPopulate = async (req, res) => {
        const id = req.params.cid
        console.log("Desde controller" + id)
        const cart = await cartRepositories.getCartByPopulate(id)
        res.send(cart)
    }

    addCartProduct = async (req, res) => {
        const id = req.params.cid
        const productId = req.params.pid

        const result = await cartRepositories.addProducts(id, productId, 1)
        res.send({status: "sucesss", payload: result})
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