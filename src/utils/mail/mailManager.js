import config  from "../../config/env.config.js";
import nodemailer from "nodemailer"
import CostumError from "../errors/customError.js";
import ERROR_TYPES from "../errors/enums.js";
class MailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: config.email_service,
            port: 587,
            auth: {
                user: config.email,
                pass: config.email_password
            }
        });
    }

    sendResetPassword = async (email, link) => {
        let mailOptions = {
            from: `Cuenta de <${config.email}>`,
            to: `${email}`,
            subject: `Restauracion de contraseña`,
            text: `El link durara 1h, hazlo es ese plazo o realiza otro link`,
            html: `
                <a href=${link}>Reset password</a>
            `
        }

        try {
            await this.transporter.sendMail(mailOptions)
            return {status: "sucess", message: "Email enviado"} 
        } catch (error) {
            throw CostumError.createError({
                name: "Mail sending error",
                cause: "There is a problem in email sending",
                message: "Error sending email",
                code: ERROR_TYPES.ERROR_INTERNAL_ERROR
            })
        }

    }

    sendMessage = async (email, subject, text) => {
        let mailOptions = {
            from: `Cuenta de <${config.email}>`,
            to: `${email}`,
            subject: `${subject}`,
            text: text,
        }
        try {
            await this.transporter.sendMail(mailOptions)
            return {status: "sucess", message: "Email enviado"} 
        } catch (error) {
            throw CostumError.createError({
                name: "Mail sending error",
                cause: "There is a problem in email sending",
                message: "Error sending email",
                code: ERROR_TYPES.ERROR_INTERNAL_ERROR
            })
        }
    }

}

export default MailManager