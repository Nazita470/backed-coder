import userModel from "../models/userModel.js";
import { cartRepositories } from "../../repositories/index.js";

class UserManager {
    getUserByID = async (id) => {
        const user = await userModel.findById(id)
        return user
    }

    createUser = async (u) => {
        if(u.rol == "admin"){ 
            u.cart = null
            return await userModel.create(u)
        }
        const cart = await cartRepositories.createCart()
        u.cart = cart._id
        const user = await userModel.create(u)
        console.log("user: " + user)
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