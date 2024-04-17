const form = document.getElementById("loginForm")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
form.addEventListener("submit", (e)=> {
    e.preventDefault()
    const email = emailInput.value
    const password = passwordInput.value
    const obj = {
        email: email,
        password: password
    }

    console.log(obj)
    fetch("/api/session/login",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => { 
        if(response.status == 200) {
            window.location.replace("/products")
        }
        response.json()
    }).then(json => console.log(json))
})

