const first_input = document.getElementById("first_password")
const second_input = document.getElementById("second_password")
const paragraph = document.getElementById("mensajes")
const formReset = document.getElementById("formReset")
formReset.addEventListener("submit", (e) => {
    e.preventDefault()
    const first_password = first_input.value
    const second_password = second_input.value
    if(!second_password || !first_password ){
        paragraph.innerText = `Ingresa valores`

        setTimeout(() => {
            paragraph.innerText = ` `
        }, 2000)
    }
   
    else if(second_password == first_password) {
        fetch("/api/session/restore/password", {
            method: "POST",
            body: JSON.stringify({password: first_password}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(result => result.json())
        .then(json => {
            if(json.status == "error") {
                paragraph.innerText = `${json.message}`

                setTimeout(() => {
                    paragraph.innerText = ` `
                }, 3000)
            }
            else {
                formReset.innerHTML = `
                    <div>
                        <p>Password modificada correctamente</p>
                        <a href="/products">Ir a products</a>
                    </div>
                `
            }
        })
    }

    else{
        paragraph.innerText = `No coinciden las contraseñas`

        setTimeout(() => {
            paragraph.innerText = ` `
        }, 2000)
    }

    first_input.value = ""
    second_input.value = ""
})