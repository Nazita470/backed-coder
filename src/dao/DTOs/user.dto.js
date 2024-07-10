export default class UserDTO {
    getUserToFront = (valores) => {
       const user = {
            name: `${valores.name} ${valores.last_name}`,
            age:valores.age,
            email: valores.email,
            cart: valores.cart,
            rol: valores.rol,
            last_connection: valores.last_connection
        }
        return user
    }

    getUserToBack = (valores) => {
        const user = {
            name: valores.name,
            last_name: valores.last_name,
            age:valores.age,
            email: valores.email,
            cart: valores.cart,
            rol: valores.rol,
            password: valores.password,
            last_connection: valores.last_connection
        }

        return user
    }
}