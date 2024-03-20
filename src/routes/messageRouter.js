import { Router } from "express";
import MessageManager from "../dao/services/messagesManager.js";

const messageRouter = new Router()
const messageManager = new MessageManager()

messageRouter.get("/", async (req, res) => {
    res.render("chat")
})

export default messageRouter