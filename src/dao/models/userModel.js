import mongoose from "mongoose";
const { Schema } = mongoose

const userSchema = new Schema({
    name: String,
    last_name: String,
    email: String,
    age: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    password: String,
    rol: "String",
})

const userModel = mongoose.model("users", userSchema)

export default userModel