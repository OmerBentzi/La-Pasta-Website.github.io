$(document).ready(function () {
    var email = localStorage.getItem("user_email")
    var userName = localStorage.getItem("user_name")
    if (email && userName) {
        document.getElementById("email").value = email;
        document.getElementById("full_name").value = userName;
    }

    var contactUsButton = document.getElementById("send");
    contactUsButton.addEventListener("click", function (event) {
        xmlHttpRequest();
    });
});

function xmlHttpRequest() {
    var full_name = document.getElementById("full_name").value
    var email = document.getElementById("email").value
    var text = document.getElementById("text").value
    if (full_name === "" || email === "" || text === "") {
        document.getElementById("contactus_success").hidden = true;
        document.getElementById("contactus_error").hidden = false;
        document.getElementById("error_text").innerHTML = "All fields must be complete";
        return
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/contactus", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Handle the successful response here
                var response = JSON.parse(xhr.responseText)
                document.getElementById("contactus_error").hidden = true;
                document.getElementById("contactus_success").hidden = false;
                document.getElementById("success_text").innerHTML = "The message was sent successfully";
            } else {
                // Handle errors here
                console.error("Error:", xhr.statusText);
            }
        }
    };

    var data = "full_name=" + encodeURIComponent(full_name) +
        "&email=" + encodeURIComponent(email) +
        "&text=" + encodeURIComponent(text);

    xhr.send(data);
}