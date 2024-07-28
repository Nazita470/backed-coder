export default class ProductDTO {
    constructor (product) {
        this.title = product.title,
        this.description = product.description,
        this.code = product.code,
        this.price = product.price,
        this.stock = product.stock,
        this.category = product.category,
        this.status = product.status,
        this.thumbnal = product.thumbnal
        this.owner = product.owner
    }
}