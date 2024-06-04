import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command()

program.option('--mode <modo>', 'Modo de desarrollo o produccion')
.parse()
dotenv.config()
const enviroment = program.opts().mode

export default {
    mode: enviroment,
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    adminUser: process.env.ADMIN_USER,
    adminPassword: process.env.ADMIN_PASSWORD
}