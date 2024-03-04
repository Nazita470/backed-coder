const socket = io()

console.log("Hola")

const formAgregar = document.getElementById("agregar")
const formEliminar = document.getElementById("eliminar")
const nombre = document.getElementById("nombreProdcuto")
const precio = document.getElementById("precio")
const inputID = document.getElementById("inputID")

formAgregar.addEventListener("submit", (e) => {
    const product = {
        nombre: nombre.value,
        precio: precio.value
    }
    console.log(product)
    nombre.value = ""
    precio.value = ""
    socket.emit("producto", product)
})

formEliminar.addEventListener("submit", (e) => {
   
    socket.emit("eliminar", inputID.value)
})