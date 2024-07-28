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
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUiExpress from "swagger-ui-express"
import ticket_router from "./routes/ticketRouter.js"
import ProductsManager from "./dao/services/product.mongo.dao.js"

const productsManager = new ProductsManager()
const app = express()
const port = valores.port || 8080
const mongoURL = valores.mongo_url
const swaggerOptions = {
    definition:{
        openapi:"3.0.1",
        info: {
            title: "Documentacion de la api de un ecommerce",
            description: "API pensada para una ecommerce, dando de baja productos, creando carritos y usarios con diferentes roles"
        }
    },

    apis:[`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
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
app.get("/mockingproducts", (req, res) => {
    const products = []
    for(let i = 0; i < 10; i++) {
        let product = generateProduct()
        products.push(product)
        productsManager.addProducts(product)
    }
    res.send(products)
})
app.use("/api/products", products_router)
app.use("/api/carts", cart_router)
app.use("/api/session", loginRouter)
app.use("/api/users", userRouter)
app.use("/api/ticket", ticket_router)
app.use("/", viewRouter)
app.use("/apidocs", swaggerUiExpress.serve,swaggerUiExpress.setup(specs, {
    customCss: ".swagger-ui .topbar {display: none}"
}))

//Error
app.use(errorsHandler)

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Mongo
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


