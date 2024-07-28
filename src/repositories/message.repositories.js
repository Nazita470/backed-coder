import MessageDTO from "../dao/DTOs/message.dto.js"
export class MessageRepositories {
    constructor (dao) {
        this.dao = dao
    }

    getMessage = async () => {
        const result = await this.dao.getMessage()
        return result
    }

    createMessage = async (m) => {
        const result = await this.dao.createMessage(new MessageDTO(m))
        return result
    }
}