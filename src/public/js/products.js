
const socket = io()
const form = document.querySelectorAll("#formulario")
const logoutButton = document.getElementById("logoutButton")
const cartElement = document.getElementById("cartId")
const cart_id = logoutButton.name
//console.log(cart_id)
form.forEach((item) => {
    item.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log(item)
        let id = item.name
        let quantity = 1 
        let product = {
            id: id,
            cart: cart_id,
            quantity: quantity
        }

        console.log(product)
        socket.emit("addProducts", product)
    })
})

logoutButton.addEventListener("click", (e) => {
    e.preventDefault()
    fetch("/api/session/logout", {
        method: "POST",
    }).then(response => response.status == 200  && window.location.replace("/login"))
})

function handleClick(e) {
    
   
}
//