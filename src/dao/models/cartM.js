
import mongoose from "mongoose";
const { Schema } = mongoose

//Holaaaa

const cartsSchema = new Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
            quantity: {
                type: Number,
                required: true,
            },
        }
    ]
})

const cartsModel = mongoose.model("carts", cartsSchema)
export default cartsModel