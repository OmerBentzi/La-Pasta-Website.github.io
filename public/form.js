function xmlHttpRequest() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;
    if (name === "" || email === "" || phone === "" || password === ""){
            alert("All fields must be complete")
            return
    } 

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/sign_up", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Handle the successful response here
          var response = xhr.responseText;
          console.log(response);
          if (response === "The Email already exists"){
            alert("The Email already exists")
          } 
          else if(response === "Sign up Succsessfully"){
            location.replace("form_sucsess.html")
          }
          console.log(response);
        } else {
          // Handle errors here
          console.error("Error:", xhr.statusText);
        }
      }
    };

    var data = "name=" + encodeURIComponent(name) +
               "&email=" + encodeURIComponent(email) +
               "&phone=" + encodeURIComponent(phone) +
               "&password=" + encodeURIComponent(password);

    xhr.send(data);
  }

  // Attach form submission to the button click event
  var signUpButton = document.getElementById("Sign Up");
  signUpButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default form submission
    xmlHttpRequest(); // Call the AJAX submission function
  });