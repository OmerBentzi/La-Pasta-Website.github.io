$(document).ready(function () {
  // Attach form submission to the button click event
  var signUpButton = document.getElementById("SignUp");
  signUpButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission
    xmlHttpRequest(); // Call the AJAX submission function
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
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var password = document.getElementById("password").value;

  if (!name || !email || !phone || !password) {
    document.getElementById("error_text").innerHTML = "All fields must be complete";
    show_error();
    return
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/sign_up", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // Handle the successful response here
        var response = JSON.parse(xhr.responseText)
        if (response.status === "Sign up Succsessfully") {
          localStorage.setItem("sign_up_user_name", response.user_name);
          location.replace("form_sucsess.html");
        }
        else {
          document.getElementById("error_text").innerHTML = response.status;
          show_error();
        }
      } else {
        // Handle errors here
        try {
          console.error("Error:", xhr.statusText);
          response = JSON.parse(xhr.responseText);
          document.getElementById("error_text").innerHTML = response.status ? response.status : "Failed Request";
        } catch (e) {
          document.getElementById("error_text").innerHTML = "Failed Request";
        }
        show_error();
      }
    }
  };

  var data = "name=" + encodeURIComponent(name) +
    "&email=" + encodeURIComponent(email) +
    "&phone=" + encodeURIComponent(phone) +
    "&password=" + encodeURIComponent(password);

  xhr.send(data);
}

function show_error() {
  var interval = setInterval(() => {
    if (document.getElementById("sign_up_error").style.opacity >= 1) {
      clearInterval(interval);
    }
    document.getElementById("sign_up_error").style.opacity = Number(document.getElementById("sign_up_error").style.opacity) + 0.05;
  }, 10);
}