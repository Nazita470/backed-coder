import express from "express"
import products_router from "./routes/productsRouter.js"
import cart_router from "./routes/cartRouter.js"

const app = express()
const port = 8080
app.listen(port, console.log("Corriendo en el puerto", port))

app.use("/api/products", products_router)
app.use("/api/carts", cart_router)
