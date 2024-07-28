import mongoose from "mongoose"
import config from "../src/config/env.config.js"
import {productRepositories} from "../src/repositories/index.js"
import {cartRepositories} from "../src/repositories/index.js"
import Assert from "assert"
import { expect } from "chai"
import exp from "constants"

mongoose.connect(config.mongo_url)
const assert = Assert.strict
describe("Testing de cart", () => {
    let cid = ""
    let productID = ""
    before(function() {
        this.user = cartRepositories
    })
    it("Debe creaer un carrito", async () => {
        const result = await cartRepositories.createCart()
        cid = result._id
        expect(result).to.be.ok
    })

    it("Debe devolver el carrito dado con populate", async () => {
        const result = await cartRepositories.getCartByPopulate(cid)
        expect(result).to.be.ok
    })
    
    it("Debe añadir un producto a un carrito con una cierta cantidad", async () => {
        const obj = {
            page: 1,
            limit: 10,
            query: {},
            sort: null
        }
        const q = 1
        const products = await productRepositories.getByPage(obj)
        const pid = await products.docs[0]._id
        productID = pid
        const result = await cartRepositories.addProducts(cid,pid,1)
        const cart = await cartRepositories.getCartByPopulate(cid)
        expect(cart[0].products[0].product._id.toString() == pid).to.be.ok

    })
    
   
    
    it("Cambiar la cantidad de un mismo producto de un carrito", async () => {
        await cartRepositories.updateProductQuantity(cid, productID, 3)
        const cart = await cartRepositories.getCartByPopulate(cid)
        expect(cart[0].products[0].quantity).to.be.equal(3)
    })

    it("Modificar un carrito", async () => {
        const obj = {
            page: 1,
            limit: 10,
            query: {},
            sort: null
        }
        const products = await productRepositories.getByPage(obj)
        const pid = await products.docs[0]
        
        await cartRepositories.updateCart([pid])
        const cart = await cartRepositories.getCartByPopulate(cid)
        expect(cart[0].products[0].product._id.toString() == pid._id).to.be.ok
    })

    it("Eliminar un producto", async () => {
        const result = await cartRepositories.deleteProduct(cid, productID)
        
        const cart = await cartRepositories.getCartByPopulate(cid)

        expect(cart[0].products.length).to.be.equal(0)
    })

  
    beforeEach(function () {
        this.timeout(5000)
    })
})