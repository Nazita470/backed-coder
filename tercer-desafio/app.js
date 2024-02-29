import { ProductManager } from "./ProductManager.js"
import express from "express"

const manager = new ProductManager()
const products = await manager.getProducts()
const path = 3000

const app = express()
app.use(express.urlencoded({extended: true}))
app.listen(path, () => console.log("Corriendo en el puerto: ", path))


app.get("/products", (req, res) => {
    const query = req.query.limit
    let newProducts = []
    query ?  newProducts = products.slice(0, query) : newProducts = [...products]
    res.send(newProducts)
})

app.get("/products/:pid", (req, res) => {
    const param = req.params.pid
    const prod = products.find((p) => p.id == param)
    const error = {error: "Producto no encontrado"}
    
    prod ? res.send(prod) : res.send(error)
})