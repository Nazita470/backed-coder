import messageModel from "../models/messagesM.js";

class MessageManager {
    getMessage = async () => {
       const m = await messageModel.find().lean()
       return m 
    }
    createMessage = async (mensaje) => {
        await messageModel.create(mensaje)
    }
}

export default MessageManager