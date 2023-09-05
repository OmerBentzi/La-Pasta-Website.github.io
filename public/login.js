$(document).ready(function () {
  // Attach form submission to the button click event
  var LoginButton = document.getElementById("Login");
  LoginButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission
    xmlHttpRequest();
  });

  var box = document.getElementById("box");
  box.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      xmlHttpRequest();
    }
  });
});

function xmlHttpRequest() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  if (!email || !password) {
    document.getElementById("error_text").innerHTML = "All fields must be complete";
    show_error();
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
          localStorage.setItem("user_items", response.user_items);
          localStorage.setItem("token", response.token);
          location.replace("index.html");
        }
        else {
          document.getElementById("error_text").innerHTML = response.status;
          show_error();
        }
      } else {
        // Handle errors here
        console.error("Error:", xhr.statusText);
        response = JSON.parse(xhr.responseText);
        document.getElementById("error_text").innerHTML = response.status ? response.status : "Failed Request";
        show_error();
      }
    }
  };

  var data = "email=" + encodeURIComponent(email) +
    "&password=" + encodeURIComponent(password);

  xhr.send(data);
}

function show_error() {
  var interval = setInterval(() => {
    if (document.getElementById("login_error").style.opacity >= 1) {
      clearInterval(interval);
    }
    document.getElementById("login_error").style.opacity = Number(document.getElementById("login_error").style.opacity) + 0.05;
  }, 10);
}