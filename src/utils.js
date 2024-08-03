import fs from "fs"
import {fileURLToPath} from "url"
import bcrypt from "bcrypt"
import { dirname } from "path"
import { Faker, es } from "@faker-js/faker"

const customFaker = new Faker({locale: [es]})
export async function leerArchivo(path){
    let products
    try{
      products = await fs.promises.readFile(path, "utf8")
    }catch(error){
        console.log(error)
    }
    return JSON.parse(products)
}

export async function escribirArchivo(path, arr){
    await fs.promises.writeFile(path, JSON.stringify(arr, null, '\t'))
}

export function validarProducto(dataProduct){
    if(dataProduct.title && dataProduct.description && dataProduct.code && dataProduct.price && dataProduct.stock && dataProduct.category && dataProduct.status){
        return true
    }
    return false
}


export function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password)
}


function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }


export function generateProduct(){
    const limite = getRandom(1, 3)
    const thumbnail = []
    for(let i = 0; i <= limite; i++) {
        thumbnail.push(customFaker.image.url())
    }
    return {
        id: customFaker.database.mongodbObjectId(),
        title: customFaker.commerce.productName(),
        description: customFaker.commerce.productAdjective(),
        code: customFaker.commerce.isbn(),
        price: customFaker.commerce.price(),
        stock: customFaker.string.numeric(),
        category: customFaker.commerce.department(),
        status: true,
        thumbnail: thumbnail,
        owner: "salvatierranazareno16@gmail.com"
    }
}

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
