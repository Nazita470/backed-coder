import { cartRepositories } from "../repositories/index.js"
import { ticketRepositories } from "../repositories/index.js"
import { productRepositories } from "../repositories/index.js"
import {v4 as uuidv4} from "uuid"


function sumarProductosCarrito(arr){
    

    const initialValue = 0
    const sum = arr.reduce((p1, p2) => p1 + (p2.product.price * p2.quantity), initialValue)
    return sum
}

class TicketController {
    create = async (req, res) => {
        const {cid} = req.params
        const carrito = await cartRepositories.getCartByPopulate(cid)
        if(!carrito) return res.status(404).send({status: "error", message: "Cart doesnt exist"})
        let newCarrito = carrito[0].products
        let sacadosDelCarrito = []
        carrito[0].products.forEach((product) => {
            if(product.product.stock >= product.quantity) {
                let q = product.product.stock - product.quantity
                productRepositories.updateProducts(product.product._id, {stock: q})
            }else {
                newCarrito = carrito[0].products.filter((p) =>  p.product._id != product.product._id)
                sacadosDelCarrito.push(product)
            }
        })
        req.logger.info(newCarrito)
        await cartRepositories.updateCart(cid, sacadosDelCarrito)
        const ticket = {
            code: uuidv4(),
            purchase_datatime: new Date(),
            amount: sumarProductosCarrito(newCarrito),
            purchaser: "naza@mail.com"
        }
        const result = await ticketRepositories.create(ticket)
        res.send({status: "sucess", message: "Ticket created", new_cart: sacadosDelCarrito, ticket: ticket})
    }
}

export default TicketController