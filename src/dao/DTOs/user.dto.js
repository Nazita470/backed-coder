export default class UserDTO {
    getUser = (valores) => {
       const user = {
            name: `${valores.name} ${valores.last_name}`,
            age:valores.age,
            email: valores.email,
            cart: valores.cart,
            rol: valores.rol
        }
        return user
    }
}