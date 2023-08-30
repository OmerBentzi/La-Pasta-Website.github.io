function xmlHttpRequest() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  if (!email || !password) {
    document.getElementById("login_error").hidden = false;
    document.getElementById("error_text").innerHTML = "All fields must be complete";
    return
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/log_in", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // Handle the successful response here
        var response = JSON.parse(xhr.responseText);
        if (response.status === "Log In Successfully") {
          localStorage.setItem("user_name", response.user_name);
          localStorage.setItem("user_email", response.user_email);
          location.replace("index.html")
        }
        else {
          document.getElementById("login_error").hidden = false;
          document.getElementById("error_text").innerHTML = response.status;
        }
      } else {
        // Handle errors here
        console.error("Error:", xhr.statusText);
      }
    }
  };

  var data = "email=" + encodeURIComponent(email) +
    "&password=" + encodeURIComponent(password);

  xhr.send(data);
}

// Attach form submission to the button click event
var signUpButton = document.getElementById("Login");
signUpButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default form submission
  xmlHttpRequest(); // Call the AJAX submission function
});
