import mongoose from "mongoose";
const { Schema }  = mongoose

const schema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    },   
    thumbnal: {
        type: [String],
        require: true
    }
})

const productsModel = mongoose.model("products", schema)

export default productsModel