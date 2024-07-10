import mongoose from "mongoose"
import config from "../src/config/env.config.js"
import {productRepositories} from "../src/repositories/index.js"
import Assert from "assert"
import { expect } from "chai"

mongoose.connect(config.mongo_url)
const assert = Assert.strict
describe("Testing de products", () => {
    let productId = ""
    before(function() {
        this.user = productRepositories
    })

    it("Crear un producto", async () => {
        const producto = {
            title: "Coca",
            description: "ifbhif",
            code: "1",
            price: 10,
            stock: 5,
            category: 4,
            owner: "admin"
        }

        const result = await productRepositories.addProducts(producto)
        productId = result.payload._id
        expect(result.payload).to.be.ok
    })

    it("Debe devolver todos los productos utilizando page", async () => {
        const obj = {
            page: 1,
            limit: 10,
            query: {},
            sort: null
        }
        const products = await productRepositories.getByPage(obj)
        expect(Array.isArray(products.docs)).to.be.ok
    })

    it("Obtener el producto por su ID", async () => {
      
        const product = await productRepositories.getById(productId)
        expect(product[0]._id).to.be.ok
    })
    
    it("Modificar un producto", async () => {
        let newP = {
            title:   "Manzana"
        } 
        // products = await productRepositories.getByPage(obj)
        const product = await productRepositories.getById(productId)
        const pid = product[0]._id
        if(product[0].title == "Manzana") newP.title = "Coca" 
        await productRepositories.updateProducts(pid, newP)
        const newProduct = await productRepositories.getById(pid)
        expect(newProduct[0].title).to.be.equal(newP.title)
    })
    
    it("Debe eliminar el producto", async () => {
        await productRepositories.deleteProducts(productId)
        const result = await productRepositories.getById(productId)
        expect(result.length).to.be.equals(0)
    })

    
    beforeEach(function () {
        this.timeout(5000)
    })
})