$(document).ready(function () {
var name = localStorage.getItem("sign_up_user_name");
document.getElementById("Text").innerHTML = "Hi , " + name + " Thank you for signing up! We're excited to have you join us.";
});