
const socket = io()
const form = document.querySelectorAll("#formulario")
const logoutButton = document.getElementById("logoutButton")
const cartElement = document.getElementById("cartId")
const cart_id = logoutButton.name
const resetPasswordButton = document.getElementById("reset")
const emailDiv = document.getElementById("email")
const resetDiv = document.getElementById("divReset")
const verCartButton = document.getElementById("verCartButton")

form.forEach((item) => {
    item.addEventListener("submit", async (e) => {
        e.preventDefault()
        let id = item.name
        let quantity = 1 
        let product = {
            id: id,
            cart: cart_id,
            quantity: quantity
        }

        //socket.emit("addProducts", product)
        const fetching = await fetch(`/api/carts/${cart_id}/products/${id}`, {
            method: "POST",
        })

        const result = await fetching.json()
        console.log(result)
    })
})

logoutButton.addEventListener("click", (e) => {
    e.preventDefault()
    console.log("click")
    fetch("/api/session/logout", {
        method: "POST",
    }).then(response => response.status == 200  && window.location.replace("/login"))
})

resetPasswordButton.addEventListener("click", (e) => {
    e.preventDefault()
    const email = emailDiv.getAttribute("email")
    const datos = {
        email: email,
        link: "http://localhost:8080/restore/password"
    }
    //socket.emit("sendEmail", datos)
    document.cookie = "email=Send; max-age=30; path=/"
    resetDiv.innerHTML += "<p>Se mando un mail para restaurar contraseña</p>"
    setTimeout(() => {

        resetDiv.innerHTML = `<button id="reset">Reset password</button>`
    }, 2000)
})

verCartButton.addEventListener("click", (e) => {
    e.preventDefault()
    const id = verCartButton.getAttribute("name")
    window.location.replace(`/cart/${id}`)
})