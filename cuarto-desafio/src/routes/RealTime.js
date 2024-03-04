import { Router} from "express"
import { products } from "../../app.js"

const realRouter = new Router()

realRouter.get("/", (req, res) => {
    res.render("realTimeProducts", {products: products})
})

export default realRouter