const logout = document.getElementById("logout")

logout.addEventListener("submit", (e) => {
    e.preventDefault()
    fetch("/api/session/logout", {
        method: "POST",
    }).then(response => response.status == 200  && window.location.replace("/login"))
})