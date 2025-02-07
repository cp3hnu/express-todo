const logoutBtn = document.getElementById("logout")
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    fetch("/user/logout", {
      method: "POST"
    }).then((res) => {
      if (res.ok) {
        location.href = "/user/signin"
      }
    })
  })
}