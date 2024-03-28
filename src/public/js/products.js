const socket = io()
const form = document.getElementById("formulario")
console.log(form)


form.addEventListener("submit", (e) => {
    e.preventDefault()
    let id = form.name
    let quantity = 1
   
    let product = {
        id: id,
        quantity: quantity
    }
    console.log(product)
   socket.emit("addProducts", product)
   
})
