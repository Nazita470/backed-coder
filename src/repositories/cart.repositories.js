import CartDTO from "../dao/DTOs/cart.dto.js";

export class CartRepositories{
    constructor (dao) {
        this.dao = dao
    }

    createCart = async () => {
        const result = this.dao.createCart()
        return result
    }

    getCartByPopulate = async (id) => {
        const result = await this.dao.getCartByPopulate(id)
        return result
    }

    addProducts = async (cid, prodId, quantity) => {
        const result = await this.dao.addProducts(cid, prodId, quantity)
        return result
    }

    deleteProduct = async (cid, pid) => {
        const result = await this.dao.deleteProduct(cid, pid)
        return result
    }

    updateProductQuantity = async (cid, pid, q) =>  {
        const result = await this.dao.updateProductQuantity(cid, pid, q)
        return result
    }

    updateCart = async (cid, cart) => {
        const newCart = new CartDTO(cart)
        const result = await this.dao.updateCart(cid, newCart.products)
        return result
    }

    deleteProductsCarts = async (cid) => {
        const result = await this.dao.deleteProductsCarts(cid)
        return result
    }
}