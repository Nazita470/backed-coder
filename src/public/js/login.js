const form = document.getElementById("loginForm")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const logoutButton = document.getElementById("logoutButton")

form.addEventListener("submit", (e)=> {
    e.preventDefault()
    const email = emailInput.value
    const password = passwordInput.value
    const obj = {
        email: email,
        password: password
    }
    fetch("/api/session/login",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => { 
        if(response.status == 200) {
            window.location.replace("/products")
        }else {
            return response.json()
        }
    }).then(result => {
        console.log(result)
        window.location.replace(`/login/error?message=${result.error}`)
    })
})

logoutButton.addEventListener("click", (e) => {
    e.preventDefault()
    fetch("/api/session/logout", {
        methos: "POST",
    }).then(response => {
        if(response.status == 200 ) {
            window.location.replace("/login")
        }
    })
})