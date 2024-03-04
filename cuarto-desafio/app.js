import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import { v4 as uuid4 } from "uuid"
import { Server } from "socket.io"

const app = express()
const port = 8080
const http = app.listen(port, () =>  console.log("Correindo en el puerto", port))

const sockServer = new Server(http)
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname+"/src/views")
app.set("view engine", "handlebars")

app.use(express.static( __dirname+"/src/public"))

let products = [
]

app.get("/", (req, res) => {
    res.render("home", {products: products})
})
app.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", {products: products})
})

app.post("/realtimeproducts", (req, res) => {
    
})

app.delete("/realtimeproducts", (req, res) => {
    
})

sockServer.on("connection", socket => {
    console.log("Nuevo cliente")

    socket.on("producto", data => {
        console.log(data)
        data.id = uuid4()
        products.push(data)
    })

    socket.on("eliminar", data => {
        console.log(data)
        let newProducts = products.filter(e => e.id != data)
        console.log(newProducts)
        products = newProducts
    })
})