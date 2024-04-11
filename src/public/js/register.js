const form = document.getElementById("registerForm")
const emailInput = document.getElementById("email")
const nameInput = document.getElementById("name")
const passwordInput = document.getElementById("password")
const last_nameInput = document.getElementById("last_name")
const ageInput = document.getElementById("age")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const data = {
        name: nameInput.value,
        last_name: last_nameInput.value,
        age: ageInput.value,
        email: emailInput.value,
        password: passwordInput.value
    }
    console.log(JSON.stringify(data))
    fetch("/api/session/register",{
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())
    .then(json => console.log(json))
})