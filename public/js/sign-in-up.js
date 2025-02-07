const cancelBtn = document.getElementById("sign-up-cancel")
const signUpBtn = document.getElementById("sign-in-sign-up")
if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    location.href = "/user/signin"
  })
}
if (signUpBtn) {
  signUpBtn.addEventListener("click", () => {
    location.href = "/user/signup"
  })
}