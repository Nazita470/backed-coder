import dotenv from "dotenv";

dotenv.config()

export default {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    adminUser: process.env.ADMIN_USER,
    adminPassword: process.env.ADMIN_PASSWORD
}