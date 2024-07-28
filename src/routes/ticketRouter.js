import { Router } from "express";
import express from "express" 
import TicketController from "../controllers/ticketControler.js";
const ticket_router = Router()
const ticketController = new TicketController()

ticket_router.use(express.json())
ticket_router.use(express.urlencoded({extended:true}))

ticket_router.get("/:tid", ticketController.getById)

export default ticket_router