const rolesButtons = document.querySelectorAll("#changeRol")
const deletesButtons = document.querySelectorAll("#deleteButton")
console.log(deletesButtons)
const messages = document.querySelectorAll("#message")

rolesButtons.forEach((item) => {
    item.addEventListener("click", async () => {
        const ID = item.name
        const result = await fetch(`api/users/premium/${ID}`, {
            method: "POST"
        }) 
        const json = await result.json()
        messages.forEach(m => {
            if(m.getAttribute("name") == ID) {
                 m.innerText = json.message
        
                 setTimeout(() => {
                    location.reload()

                    m.innerText = ""
                }, 1000)
            }
        }) 
    })
})

deletesButtons.forEach((item) => {
    item.addEventListener("click", async () => {
        const ID = item.name
        const result = await fetch(`api/users/${ID}`, {
            method: "DELETE"
        }) 
        location.reload()
        const json = await result.json()
       /* messages.forEach(m => {
            if(m.getAttribute("name") == ID) {
                 m.innerText = json.message
        
                 setTimeout(() => {
                    m.innerText = ""
                }, 3000)
            }
        }) */
    })
})

