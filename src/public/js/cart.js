const ticketButton = document.getElementById("ticketButton")
const deleteButtons = document.querySelectorAll("#deleteButton")

deleteButtons.forEach((item) => {
    item.addEventListener("click", async () => {
        const productId = item.getAttribute("name")
        const cid = ticketButton.getAttribute("name")

        const feching = await fetch(`/api/carts/${cid}/products/${productId}`, {
            method: "DELETE"
        })

        const json = await feching.json()

        console.log(json)

        location.reload()
    })
})

ticketButton.addEventListener("click", async (e) => {
    e.preventDefault()
    const id = ticketButton.getAttribute("name")
    console.log(id)
    const feching = await fetch(`/api/carts/${id}/purchase`, {
        method: "POST"
    })
    const result = await feching.json()
    console.log(result)

    result.status == "sucess" && window.location.replace(`/ticket/${result.ticket.code}`)
})