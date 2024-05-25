import ProductDTO from "../dao/DTOs/product.dto.js";

export  class ProductRepositories {
    constructor (dao) {
        this.dao = dao
    }

    getByPage = async (objeto) => {
        const result = await this.dao.getByPage(objeto)
        return result
    }

    getById = async (id) => {
        const product = await this.dao.getById(id)
        return product
    }

    deleteProducts = async (id) => {
        let result = await this.dao.deleteProducts(id)
        return result
    }

    updateProducts = async (id, p) => {
        let newProduct = new ProductDTO(p)
        let result = await this.dao.updateProducts(id, newProduct)
        return result
    }

    addProducts = async (p) => {
        let newProduct = new ProductDTO(p)
        let result = await this.dao.addProducts(newProduct)
        return result
    }
}