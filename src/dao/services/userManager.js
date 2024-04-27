import userModel from "../models/userModel.js";
import CartManager from "./cartManager.js";

const cartManager = new CartManager()
class UserManager {
    getUserByID = async (id) => {
        const user = await userModel.findById(id)
        return user
    }

    createUser = async (u) => {
        const cart = await  cartManager.createCart()
        u.cart = cart
        const user = await userModel.create(u)
        return user
    }

    getUserPopulate = async (id) => {
        const user = await userModel.findById(id).populate("cart").lean()
        return user
    }

    getByEmail = async (email) => {
        const user = await userModel.findOne({email: email})
        return user
    }

    updateUser = async (id, user) => {
        const result = await userModel.updateOne({_id: id}, {$set: user})
        return result
    }

    deteleUser = async (id) =>{
        const result = await userModel.deleteOne({_id: id})
        return result
    }
}

export default UserManager