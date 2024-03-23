import cartsModel from "../models/cartM.js"

class CartManager {
    getCartById = async (id) => {
        const carts = await cartsModel.find({_id: id})
        return carts
    }
    createCart = async () => {
        const cart = await cartsModel.create({})
        return cart
    }
    addProducts = async (cid, prodId, quantity) => {
        try{
            const cart = await cartsModel.find({_id: cid})
            console.log(cart[0].products)
            const product = cart[0].products.find((p) => p.product.toString() == prodId)

            if(product) {
                product.quantity += quantity
            }else {
                cart[0].products.push({product: prodId, quantity: quantity})
        
            }

            return await cart[0].save()
        }catch(e) {
            console.error(e)
        }
       
    }

    deleteProduct = async (cid, pid) => {
        const cart = cartsModel.find({__id: cid})
        const product = cart.products.findIndex((p) => p.product.toString() == pid) 

        if(product > 0) {
            cart.products.slice(product)
        }else {
            console.log("producto no encontrado")
        }
    }

    deleteCart = async (cid) => {
        const result = await cartsModel.deleteOne({__id:cid})
        return result
    }

    addL = async () => {
        
    }

}

export default CartManager