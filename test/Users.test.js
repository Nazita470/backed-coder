import mongoose from "mongoose"
import config from "../src/config/env.config.js"
import {userRepositories} from "../src/repositories/index.js"
import Assert from "assert"
import { expect } from "chai"
import supertest from "supertest"

mongoose.connect(config.mongo_url)
const requester = supertest("http://localhost:8080")
const assert = Assert.strict
describe("Testing de user", () => {
    before(function() {
        this.user = userRepositories
    })

    it("Debe devolver el usuario con ese email", async () => {
        let email = "naza@mail.com"
        const result = await userRepositories.getByEmail(email)
        assert.ok(result._id)
    })

    it("Debe crear un usario", async () => {
        let usuario = {
            email: "456@mail.com",
            name: "Naza",
            last_name: "jbej",
            age: 13,
            password: "123"
        }
        await userRepositories.createUser(usuario)
        const result = await userRepositories.getByEmail(usuario.email)
        expect(result._id).to.be.ok
    })

    it("Debe modificar un usuario", async () => {
        let usuario = {
            email: "456@mail.com",
            name: "Rodrigo",
        }

        await userRepositories.updateUser(usuario.email, usuario)
        const result = await userRepositories.getByEmail(usuario.email)
        expect(result.name).deep.equal(usuario.name)
    })
    beforeEach(function () {
        this.timeout(5000)
    })
})