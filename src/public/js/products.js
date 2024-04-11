const socket = io()
const form = document.getElementById("formulario")
console.log(form)
const logoutButton = document.getElementById("logoutButton")


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

logoutButton.addEventListener("click", (e) => {
    console.log("Click")
    e.preventDefault()
    fetch("/api/session/logout", {
        method: "POST",
    }).then(response => response.status == 200  && window.location.replace("/login"))
})
//