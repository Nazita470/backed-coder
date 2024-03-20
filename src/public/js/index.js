const socket = io()
const form = document.getElementById("formMessage")
const input = document.getElementById("input")
let user = ""

Swal.fire({
    title: "Identificate",
    input:"text",
    text: "Ingresa un nombre de usuario",
    inputValidator: (value) => {
        return !value && "¡Necesitas inmgresar un nombre usuario para continuar!"
    },
    allowOutsideClick: false
}).then(result =>{
     user = result.value
     console.log(user)
})

console.log(form)

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let message = input.value
    let mens = {user: user, message: message}
    console.log(mens)

    if(message.trim().length > 0 ) {
        socket.emit("message", mens)
        input.value = ""
    }
   
})

socket.on("productosBase", data => {
    console.log("index")
    let log = document.getElementById("messageLog")
    let messages = "";
    data.forEach(message => {
        messages = messages + `<br>${message.user} dice: ${message.message} </br>`
    })

    log.innerHTML = messages
})

socket.on("messageLogs", data => {
    console.log("index")
    let log = document.getElementById("messageLog")
    let messages = "";
    data.forEach(message => {
        messages = messages + `<br>${message.user} dice: ${message.message} </br>`
    })

    log.innerHTML = messages
})

