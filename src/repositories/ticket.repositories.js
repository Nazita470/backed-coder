import TicketDTO from "../dao/DTOs/user.dto.js";

export  class TicketRepositories {
    constructor(dao) {
        this.dao = dao
    }

    create = async (ticket) => {
        let newTicket = new TicketDTO(ticket)
        let result = this.dao.create(newTicket)
        return result
    }
}