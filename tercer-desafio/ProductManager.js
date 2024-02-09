import fs from "fs"
import { json } from "stream/consumers"
export class ProductManager{
    contador = 1
    constructor(){
        this.path = "./products.json"
        
    }
    async getProducts(){
        const data = await fs.promises.readFile(this.path, "utf-8")
        const products = JSON.parse(data)
        return products
    }
    async addProduct(product){
        if(product.title && product.description && product.price && product.thumbnail && product.stock && product.code){
            const products = await this.getProducts()
            const productId = {
                id: this.contador,
                ...product
            }

            this.contador = this.contador + 1

            products.push(productId)

            try{
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
                
                console.log("Producto agregado")
                
            }catch(err) {
                console.error(err)
            }

        }
       
       
    }

    async getProductById(id){
        const products = await this.getProducts()
        const prod = products.findIndex((p) => p.id === id)
        if(products[prod]) return products[prod]
        return "No se encontro el producto"
    }

    async deleteProduc(id){
        const products = await this.getProducts()
        const newProducts = products.filter((e) => e.id != id)

        try{
            await fs.promises.writeFile(this.path, JSON.stringify(newProducts))
            return "Producto eliminado"
        }catch(err) {
            console.error(err)
        }
    }

    async updateProduct(id, product) {
        if(product.title && product.description && product.price && product.thumbnail && product.stock && product.code){
           const p = await this.getProductById(id)
           console.log(p.id)
           const newP = {
                id: p.id,
                ...product
           }
           await this.deleteProduc(id)

           const products = await this.getProducts()
            products.push(newP)

           try{
                await fs.promises.writeFile(this.path, JSON.stringify(products))
            }catch(err) {
                console.error(err)
            }

        }

    }
}