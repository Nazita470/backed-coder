import fs from "fs"
import {fileURLToPath} from "url"
import { dirname } from "path"

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


const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
