function xmlHttpRequest() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/log_in", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Handle the successful response here
          var response = xhr.responseText;
          if (response === "Incorrect Email or Password"){
            alert("Incorrect Email or Password")
          } 
          else if(response === "Log In Successfully"){
            location.replace("index.html")
          }
          console.log(response);
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
  signUpButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    xmlHttpRequest(); // Call the AJAX submission function
});
