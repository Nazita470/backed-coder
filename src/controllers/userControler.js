import { userRepositories } from "../repositories/index.js"
import { isValidPassword } from "../utils.js"
import { createHash } from "../utils.js"
class UserController {
    changePassword = async (req, res) => {
        const userEmail = req.session.user.email 
        console.log(userEmail)
        const password = req.body
        const user = await userRepositories.getByEmail(userEmail)
        if(isValidPassword(user, password.password)){
           console.log("Contraseña es la misma")
           return res.send({status: "error", message: "It is the same password you already have"})
        }
        user.password = createHash(password.password)
        console.log(user)
        await userRepositories.updateUser(userEmail, user)
        res.send({status: "sucess", message: "Password reset"})
    }
}

export default UserController