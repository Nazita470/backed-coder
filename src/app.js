import express from "express"
import products_router from "./routes/productsRouter.js"
import cart_router from "./routes/cartRouter.js"
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js"
import { Server } from "socket.io"
import mongoose from "mongoose"
import viewRouter from "./routes/viewsRouter.js"
import session from "express-session"
import MongoStore from "connect-mongo"
import loginRouter from "./routes/loginRouter.js"
import initializePassport from "./config/passport.config.js"
import passport from "passport"
import valores from "./config/env.config.js"
import { cartRepositories } from "./repositories/index.js"
import { messageRepositories } from "./repositories/index.js"
import { errorsHandler } from "./middlewars.js"
import { generateProduct } from "./utils.js"
import { addLogger } from "./utils/logger/logger.js"
import MailManager from "./utils/mail/mailManager.js"
import { createHash } from "./utils.js"
import cookieParser from "cookie-parser"
import userRouter from "./routes/userRouter.js"
const app = express()
const port = valores.port
const mongoURL = valores.mongo_url
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
app.use(addLogger)
app.use(cookieParser("Naza123"))
//routes

app.get("/loggerTest", (req, res) => {
    req.logger.debug("Alerta")
    req.logger.http("Alerta")
    req.logger.info("Alerta")
    req.logger.warning("Alerta")
    req.logger.error("Alerta")
    req.logger.fatal("Alerta")
    res.send({message: "Prueba logger"})
})
app.use("/api/products", products_router)
app.use("/api/carts", cart_router)
app.use("/api/session", loginRouter)
app.use("/api/users", userRouter)
app.use("/", viewRouter)
app.get("/mockingproducts", (req, res) => {
    const products = []
    for(let i = 0; i < 100; i++) {
        products.push(generateProduct())
    }
    res.send(products)
})

//Error
app.use(errorsHandler)

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
console.log(createHash("123"))


connectMongoDB()

//socket
const server = app.listen(port, console.log("Corriendo en el puerto", port))
const socketServer = new Server(server)
const mailManager = new MailManager()
socketServer.on("connection", socket => {

    messageRepositories.getMessage()
    .then((data) =>{
         socket.emit("productosBase", data)
    })

    socket.on("message", async data => {
        await messageRepositories.createMessage(data)
        let mensajes = await messageRepositories.getMessage()
        socketServer.emit("messageLogs", mensajes)
    })

    socket.on("addProducts", async data => {
        console.log("data:")
        await cartRepositories.addProducts(data.cart, data.id, data.quantity)
    })

    socket.on("sendEmail", async data => {
        await mailManager.sendResetPassword(data.email, data.link)
    })
})


