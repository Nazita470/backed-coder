import express, { urlencoded } from "express"
import products_router from "./routes/productsRouter.js"
import cart_router from "./routes/cartRouter.js"
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js"
import { Server } from "socket.io"
import mongoose from "mongoose"
import MessageManager from "./dao/services/messagesManager.js"
import messageRouter from "./routes/messageRouter.js"

const app = express()
const port = 8080
const mongoURL = 'mongodb://127.0.0.1:27017/ecommerce?retryWrites=true&w=majority'
const messageManager = new MessageManager

//Middlewares


app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))
app.engine('handlebars', handlebars.engine())

//routes

app.use("/api/products", products_router)
app.use("/api/carts", cart_router)
app.use("/chat",  messageRouter)

const connectMongoDB = async () => {
    try {
        await mongoose.connect(mongoURL)
        console.log("Conectado a mongo")
    } catch (error) {
        console.error(error)
        process.exit()
    }
}

connectMongoDB()

//socket
const server = app.listen(port, console.log("Corriendo en el puerto", port))
const socketServer = new Server(server)

socketServer.on("connection", socket => {
    console.log("Conectado a socket")

    messageManager.getMessage()
    .then((data) =>{
         socket.emit("productosBase", data)
         console.log(data)
    })

    socket.on("message", async data => {
        await messageManager.createMessage(data)
        let mensajes = await messageManager.getMessage()
        socketServer.emit("messageLogs", mensajes)
    })
})


