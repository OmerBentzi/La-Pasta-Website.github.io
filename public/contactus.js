function xmlHttpRequest() {
    var full_name = document.getElementById("full_name").value
    var email = document.getElementById("email").value
    var text = document.getElementById("text").value
    if (full_name === "" || email === "" || text === "") {
        alert("All fields must be complete")
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


var signUpButton = document.getElementById("send");
signUpButton.addEventListener("click", function (event) {
    xmlHttpRequest();
    location.replace("contactus.html");
});