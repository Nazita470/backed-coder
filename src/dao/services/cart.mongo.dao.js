import cartsModel from "../models/cartM.js"

class CartManager {

    getCartById = async (id) => {
        const carts = await cartsModel.find({_id: id}).lean()
        return carts
    }

    getCartByPopulate = async id => {
        const carts = await cartsModel.find({_id: id}).populate("products.product").lean()
        return carts               
    }
    
    createCart = async () => {
        const cart = await cartsModel.create({})
        return cart
    }

    addProducts = async (cid, prodId, quantity) => {
        console.log(
            `cid: ${cid}, prodId: ${prodId}, quantity: ${quantity}`
        )
        try{
            const cart = await cartsModel.find({_id: cid})
            const product = cart[0].products.find((p) =>p.product.toString() == prodId )

            console.log("Producto:",product)
            
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
        try{
            const cart = await cartsModel.find({_id: cid})
            const product = cart[0].products.find((p) => p.product.toString() == pid)
            console.log(product)
            if(product) {
                cart[0].products.splice(product, 1)
                return await cart[0].save()
            }else {
                console.log("producto no encontrado")
                return false
            }
        }catch(error) {
            console.error(error)
        }

    }

    updateCart = async (cid, cart) => {
        try{
         await cartsModel.updateOne({"_id": cid}, {$set: {products: cart}})
        }catch(e) {
            console.error(e)
        }
    }

    updateProductQuantity = async (cid, pid, q) =>{
        try{
            const cart = await cartsModel.find({_id: cid})
            console.log("Carrito", cart[0])
            const product = cart[0].products.find((p) => p.product.toString() == pid) 
            //console.log(product)

            if(product) {
                product.quantity = q
            }else {
                return false
            }

            console.log(cart[0])

            return await cart[0].save()

        }catch(error) {
            console.error(error)
        }
    }

    deleteProductsCarts = async (cid) => {
        console.log("hola")
        await cartsModel.updateOne({"_id": cid}, {$set: { products : []}})
    }

}

export class CartFyleManager {
    
}



export default CartManager