import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
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
    owner: {
        type: String,
        require: true
    },
    thumbnal: {
        type: [String],
        require: true
    }
   
})
schema.plugin(mongoosePaginate)

const productsModel = mongoose.model("products", schema)

export default productsModel