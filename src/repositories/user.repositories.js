import UserDTO from "../dao/DTOs/user.dto.js";

const userDTO = new UserDTO()
export default class UserRepositories {
    constructor(dao) {
        this.dao = dao
    }

    getUserByID = async (id) => {
        const result = await this.dao.getUserByID(id)
        return result
    }

    createUser = async (user) => {
        let result = await this.dao.createUser(userDTO.getUserToBack(user))
        return result
    }  

    getUserPopulate = async (id) => {
        let result = await this.dao.getUserPopulate(id)
        return result
    }

    getByEmail = async (email) => {
        let result = await this.dao.getByEmail(email)
        return result
    }

    updateUser = async (id, user) => {
        const result = await this.dao.updateUser(user, id)
        return result
    }

    deteleUser = async (id) => {
        const result = await this.dao.result.deteleUser(id)
        return result
    }

    getUserToFront = async (email) => {
        let result = await this.dao.getByEmail(email)
        let user = userDTO.getUserToFront(result)
        return user
    }

    
}