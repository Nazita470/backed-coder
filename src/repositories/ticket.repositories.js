import TicketDTO from "../dao/DTOs/user.dto.js";

export  class TicketRepositories {
    constructor(dao) {
        this.dao = dao
    }

    create = async (ticket) => {
        let result = this.dao.create(ticket)
        return result
    }

    getById = async (tid) => {
        const ticket = await this.dao.getById(tid)
        return ticket
    }

    
    getByCode = async (code) => {
        const ticket = await this.dao.getByCode(code)
        return ticket
    }

}