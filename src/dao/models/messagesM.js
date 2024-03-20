import moongose from "mongoose"

const messageCollection = 'message'

const messageSchema = new moongose.Schema({
    user:String,
    message:String

})

const messageModel = moongose.model(messageCollection, messageSchema)
export default messageModel