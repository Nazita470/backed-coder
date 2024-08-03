import cartsModel from "../models/cartM.js"

class CartManager {

    getCartById = async (id) => {
        let carts
        try {
            carts = await cartsModel.find({_id: id}).lean()
            
        } catch (error) {
        }
        
        return carts
    }

    getCartByPopulate = async id => {
        let carts
        try {
            carts = await cartsModel.find({_id: id}).populate("products.product").lean()
            
        } catch (error) {
             carts = null
        }
        return carts               
    }
    
    createCart = async () => {
        const cart = await cartsModel.create({})
        return cart
    }

    addProducts = async (cid, prodId, quantity) => {
        try{
            const cart = await cartsModel.find({_id: cid})

            if(!cart) {
                return {error: "Cart not found"}
            }

            const product = cart[0].products.find((p) => p.product.toString() == prodId )

            if(product) {
                product.quantity += quantity
            }else {

                cart[0].products.push({product: prodId, quantity: quantity})
        
            }

            return await cart[0].save()
        }catch(e) {
        }
       
    }

    deleteProduct = async (cid, pid) => {
        try{
            const cart = await cartsModel.find({_id: cid})
            const product = cart[0].products.find((p) => p.product.toString() == pid)
            if(product) {
                cart[0].products.splice(product, 1)
                return await cart[0].save()
            }else {
                return false
            }
        }catch(error) {
        }

    }

    updateCart = async (cid, cart) => {
        try{
         await cartsModel.updateOne({"_id": cid}, {$set: {products: cart}})
        }catch(e) {
            
        }
    }

    updateProductQuantity = async (cid, pid, q) =>{
        try{
            const cart = await cartsModel.find({_id: cid})
            const product = cart[0].products.find((p) => p.product.toString() == pid) 

            if(product) {
                product.quantity = q
            }else {
                return false
            }


            return await cart[0].save()

        } catch(error) {
        }
    }

    deleteProductsCarts = async (cid) => {
        await cartsModel.updateOne({"_id": cid}, {$set: { products : []}})
    }

}

export class CartFyleManager {
    
}



export default CartManager