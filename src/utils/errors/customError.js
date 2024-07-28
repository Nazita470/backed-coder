export default class CostumError {
    static createError({name, cause, message, code}) {
        const error = new Error(message, {cause})
        error.name = name 
        error.code = code
        return error
    }
}