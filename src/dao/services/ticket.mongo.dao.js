import ticketModel from "../models/ticketModel.js";
import {v4 as uuidv4} from "uuid"

function sumarProductosCarrito(arr){
    const initialValue = 0
    const sum = arr.reduce((p1, p2) => p1 + (p2.product.price * p2.quantity), initialValue)
    return sum
}
class TicketManager {
    create = async ({code, amount, purchaser, purchase_datatime}) => {
        let ticket = {
            code,
            amount,
            purchaser,
            purchase_datatime
        }
        await ticketModel.create(ticket)
        return ticket
    }

    getById = async (uid) => {
        console.log(uid)
        const ticket = await ticketModel.find({_id: uid})
        return ticket
    }

    getByCode = async (code) => {
        const ticket = await ticketModel.find({code: code})
        return ticket
    }
}




export default TicketManager