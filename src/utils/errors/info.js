export const generateUserErrorInfo = (user) => {
    return `One or more propierties were incomplete or not valid. 
    List of requerid propierties:
    * name : needs to be a String: received ${user.name}
    * last_name: needs to be String: received ${user.last_name}
    * email: needs to be a String: received ${user.email}
    * age: needs to be a String: receied ${user.age}
    `
}

export const generateProductErrorInfo = (product) => {
    return `One or more propierties were incomplete or not valid. 
    List of requerid propierties:
    * title : needs to be a String: received ${product.title}
    * description : needs to be a String: received ${product.description}
    * code : needs to be a String: received ${product.code}
    * price : needs to be a Number: received ${product.price}
    * stock : needs to be a Number: received ${product.stock}
    * category : needs to be a String: received ${product.category}
    * status : needs to be a String: received ${product.status}
    * thumbnail : needs to be a String: received ${product.thumbnail}
    `
}