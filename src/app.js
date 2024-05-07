import express from "express"
import products_router from "./routes/productsRouter.js"
import cart_router from "./routes/cartRouter.js"
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js"
import { Server } from "socket.io"
import mongoose from "mongoose"
import MessageManager from "./dao/services/messagesManager.js"
import CartManager from "./dao/services/cartManager.js"
import viewRouter from "./routes/viewsRouter.js"
import session from "express-session"
import MongoStore from "connect-mongo"
import loginRouter from "./routes/loginRouter.js"
import initializePassport from "./config/passport.config.js"
import passport from "passport"
import valores from "./config/env.config.js"

const app = express()
const port = valores.port
const mongoURL = valores.mongo_url
const messageManager = new MessageManager
const cartManager = new CartManager()

//Middlewares
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')
app.use(express.urlencoded({extended: true}))
app.use(session({
    store:new MongoStore({
        mongoUrl: mongoURL,
        ttl: 3600
    }),
    secret:"Hola",
    resave:false,
    saveUninitialized: false
}))
app.use(express.static(__dirname+'/public'))
app.engine('handlebars', handlebars.engine())

//routes
app.use("/api/products", products_router)
app.use("/api/carts", cart_router)
app.use("/api/session", loginRouter)
app.use("/", viewRouter)

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
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
    })

    socket.on("message", async data => {
        await messageManager.createMessage(data)
        let mensajes = await messageManager.getMessage()
        socketServer.emit("messageLogs", mensajes)
    })

    socket.on("addProducts", async data => {
        console.log("cart: " + data.cart)
        await cartManager.addProducts(data.cart, data.id, data.quantity)
        console.log("agregado")
    })
})


