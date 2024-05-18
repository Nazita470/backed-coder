import ticketModel from "../models/ticketModel.js";
import {v4 as uuidv4} from "uuid"

function sumarProductosCarrito(arr){
    const initialValue = 0
    const sum = arr.reduce((p1, p2) => p1 + (p2.product.price * p2.quantity), initialValue)
    return sum
}
class TicketManager {
    create = async (arr, purchaser) => {
        console.log("arr: " + arr)
        const purchase_datatime = new Date()
        const amount = sumarProductosCarrito(arr)
        console.log(amount)
        const code = uuidv4()
        let ticket = {
            code,
            amount,
            purchaser,
            purchase_datatime
        }
        await ticketModel.create(ticket)
        return ticket
    }
}




export default TicketManager