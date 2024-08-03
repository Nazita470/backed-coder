import { userRepositories } from "../repositories/index.js"
import { isValidPassword } from "../utils.js"
import { createHash } from "../utils.js"
class UserController {
    changePassword = async (req, res) => {
        const userEmail = req.session.user.email 
        const password = req.body
        const user = await userRepositories.getByEmail(userEmail)
        if(isValidPassword(user, password.password)){
           return res.send({status: "error", message: "It is the same password you already have"})
        }
        user.password = createHash(password.password)
        await userRepositories.updateUser(userEmail, user)
        res.send({status: "sucess", message: "Password reset"})
    }
}

export default UserController