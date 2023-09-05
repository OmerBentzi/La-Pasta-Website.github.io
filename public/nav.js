$(document).ready(function () {
    if ($(document).width() <= 992) {
        $(".navbar-nav").removeClass("ml-auto");
        $(".navbar-nav").addClass("mr-auto");
    } else {
        $(".navbar-nav").removeClass("mr-auto");
        $(".navbar-nav").addClass("ml-auto");
    }

    $(".navbar a").on("click", function (event) {
        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // console.log(this);
            // console.log(this.hash);
            // Prevent default anchor click behavior
            event.preventDefault();
            // Store hash
            var hash = this.hash;
            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $("html, body").animate(
                {
                    scrollTop: $(hash).offset().top,
                },
                800,
                function () {
                    // Add hash (#) to URL when done scrolling (default click behavior)
                    window.location.hash = hash;
                }
            );
        } // End if
    });

    var email = localStorage.getItem("user_email")
    var userName = localStorage.getItem("user_name")
    if (email && userName) {
        document.getElementById("login").hidden = true;
        document.getElementById("logout").hidden = false;
        document.getElementById("user_name").hidden = false;
        document.getElementById("user_name").innerHTML = "Hi , " + localStorage.getItem("user_name");

    } else {
        document.getElementById("user_name").hidden = true;
        document.getElementById("logout").hidden = true;
        document.getElementById("login").hidden = false;
    }

    document.getElementById("logout").addEventListener("click", function (event) {
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_items");
        localStorage.removeItem("token");
        document.getElementById("logout").hidden = true;
        document.getElementById("user_name").hidden = true;
        document.getElementById("login").hidden = false;
        location.reload();
    });
});