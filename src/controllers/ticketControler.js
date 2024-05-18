import TicketManager from "../dao/services/ticketManager.js"
import CartManager from "../dao/services/cartManager.js"
import ProductManager from "../dao/services/productManager.js"
const cartManager = new CartManager()
const ticketManager = new TicketManager()
const productManager = new ProductManager() 



class TicketController {
    create = async (req, res) => {
        const {cid} = req.params
        const carrito = await cartManager.getCartByPopulate(cid)
        if(!carrito) return res.status(404).send({status: "error", message: "Cart doesnt exist"})
        let newCarrito = carrito[0].products
        let sacadosDelCarrito = []
        carrito[0].products.forEach((product) => {
            if(product.product.stock >= product.quantity) {
                let q = product.product.stock - product.quantity
                console.log("quantity: " + q)
                productManager.updateProducts(product.product._id, {stock: q})
            }else {
                newCarrito = carrito[0].products.filter((p) =>  p.product._id != product.product._id)
                sacadosDelCarrito.push(product)
            }
        })
        console.log(sacadosDelCarrito)
        await cartManager.updateCart(cid, sacadosDelCarrito)
        const ticket = await ticketManager.create(newCarrito,"naza@mail.com")
        res.send({status: "sucess", message: "Ticket created", new_cart: sacadosDelCarrito, ticket: ticket})
    }
}

export default TicketController