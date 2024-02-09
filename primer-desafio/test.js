class ProductManager {
    contador = 1
    constructor() {
        this.products = []
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if(title && description && price && thumbnail && stock && code){
            if(this.products.find(product => product.code == code)){
                console.log("Code repetido")
            }else {
                const producto = {
                    id: this.contador,
                    code: code,
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    stock: stock
                }
                this.contador += 1
                this.products = [...this.products, producto]
            }
           
        }else {
            console.log("Formulario incompleto")
        }
       
    }

    getProducts() {
        return Object.entries(this.products)
    }

    getProductById(id) {
        const found = this.products.find(product => product.id == id)
        if(found) return found
        return "Not found"
    }
    
}
