import mongoose from "mongoose"
import config from "../src/config/env.config.js"
import {productRepositories, userRepositories} from "../src/repositories/index.js"
import Assert from "assert"
import { expect } from "chai"
import supertest from "supertest"

mongoose.connect(config.mongo_url)
const requester = supertest("http://localhost:8080")
const assert = Assert.strict

describe("Testing de la ecommerce", () => {
    describe("Testing de products", () => {
        it("EL endpoint GET /api/products devuelve todos los productos", async () => {
            const  {statusCode, ok, _body} = await requester.get("/api/products")
            expect(ok).to.be.ok
        })

        it("EL endpoint POST /api/products debe crear un producto", async () =>{
            const producto = {
                title: "Coca",
                description: "ifbhif",
                code: "1",
                price: 10,
                stock: 5,
                category: 4
            }
            const {statusCode, ok, _body} = await requester.post("/api/products").send(producto)
            expect(statusCode).deep.equal(200)
        })

        it("El endpoint GET /api/products/:pid debe devolver el producto con ese id", async () => {
            const pid = "6665b5c468b13a5a010ca0dc"
            const {statusCode, ok, _body} = await requester.get(`/api/products/${pid}`)
            expect(_body[0]._id).to.be.ok
        })

        it("El endpoint PUT api/products/:pid", async () => {
            const pid = "6665b5c468b13a5a010ca0dc"
            const product = {
                title: "Pepsi"
            }

            const {statusCode, ok, _body} = await requester.put(`/api/products/${pid}`).send(product)
            expect(ok).to.be.ok
        })

        it("El endpoint DELETE /api/products/:pid debe eliminar ese producto", async () => {
            const pid = "6665b5c468b13a5a010ca0dc"
            const {statusCode, ok, _body} = await requester.delete(`/api/products/${pid}`)
            expect(ok).to.be.ok

        })
    })

    describe("Testing de carts", () => {
        it("El endpoint POST api/carts debe creaer un carrito", async () => {
            const {statusCode, ok, _body} = await requester.post("/api/carts")
            expect(_body.payload._id).to.be.ok
        })
        it("El endpoint GET api/:cid debe devolver el cart solicitado", async () => {
            const cid = "664643e5ccd51d434538587f"
            const {statusCode, ok, _body} = await requester.get(`api/carts/${cid}`)
            console.log(statusCode)
            expect(statusCode).to.be.equal(200)
        })
    })
})