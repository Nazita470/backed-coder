import UserDTO from "../dao/DTOs/user.dto.js";

const userDTO = new UserDTO()
export default class UserRepositories {
    constructor(dao) {
        this.dao = dao
    }

    getUser = async (email) => {
        let result = await this.dao.getByEmail(email)
        let user = userDTO.getUser(result)
        return user
    }
}