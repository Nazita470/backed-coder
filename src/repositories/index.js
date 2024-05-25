import UserManager from "../dao/services/user.mongo.dao.js";
import UserRepositories from "./user.repositories.js";
import { ProductRepositories } from "./products.repositories.js";
import ProductsManager from "../dao/services/product.mongo.dao.js";
import { CartRepositories } from "./cart.repositories.js";
import CartManager from "../dao/services/cart.mongo.dao.js";
import { TicketRepositories } from "./ticket.repositories.js";
import TicketManager from "../dao/services/ticket.mongo.dao.js";
import MessageManager from "../dao/services/message.mongo.dao.js"
import { MessageRepositories } from "./message.repositories.js";

export const userRepositories = new UserRepositories(new UserManager())
export const productRepositories = new ProductRepositories(new ProductsManager())
export const cartRepositories = new CartRepositories(new CartManager())
export const ticketRepositories = new TicketRepositories(new TicketManager())
export const messageRepositories = new MessageRepositories(new MessageManager())