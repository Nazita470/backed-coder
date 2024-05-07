import CartManager from "../dao/services/cartManager";

const cartManager = new CartManager()
class CartController{
    createCart = async (req, res) => {
        const cart = await cartManager.createCart()
        res.send({status: sucess, payload: cart})
    }
    getByIdPopulate = async (req, res) => {
        const id = req.params.cid
        const cart = await cartManager.getCartByPopulate(id)
        res.send(cart)
    }

    addCartProduct = async (req, res) => {
        const id = req.params.cid
        const productId = req.params.pid

        const result = await cartManager.addProducts(id, productId, 1)
        res.send({status: "sucesss", payload: result})
    }

    deleteCartProduct = async (req, res) => {
        const cid = req.params.cid
        const pid = req.params.pid
    
        const result = await cartManager.deleteProduct(cid, pid)
        if(!result) return res.send({status: "error", message: "product not exists"}) 
        return res.send({status: "sucess", message: "product eliminated"})
    }
    

    updateCartProduct = async (req, res) => {
        const {cid, pid} = req.params
        const q = req.body.quantity
        cartManager.updateProductQuantity(cid, pid, q)
        res.send({status: "sucess", message: "Product modified"})
    }

    updateCart = async (req, res) => {
        const cid = req.params.cid
        const products = req.body
        const cart = await cartManager.updateCart(cid, products)
        res.send({status: "sucess", message:  cart})
    }

    deleteCart = async (req, res) => {
        const cid = req.params.cid
        cartManager.deleteProductsCarts(cid)
        res.send({status: "sucess", message: "cart eliminated"})
    }
}

export default CartController