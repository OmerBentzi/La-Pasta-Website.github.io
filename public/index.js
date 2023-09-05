let food = [];
let totalAmount = 0;

$(document).ready(function () {

  var scrollToTopBtn = $("#scrollToTop");

  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      scrollToTopBtn.addClass("show");
    } else {
      scrollToTopBtn.removeClass("show");
    }
  });

  scrollToTopBtn.on("click", function (event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      "500"
    );
  });

  $(".homeBtn").click(function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      let hash = this.hash;

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
    }
  });

  $(".product-box-layout4").click(function () {
    $(this)
      .toggleClass("productClicked")
      .parent()
      .siblings("div")
      .children()
      .removeClass("productClicked");
    if ($(this)[0].className.search("momos productClicked") > -1) {
      $("#momos").show().siblings("div").hide();

      $("html, body").animate(
        {
          scrollTop: $("#momos").offset().top,
        },
        800,
        function () { }
      );
    } else if ($(this)[0].className.search("chinese productClicked") > -1) {
      $("#chinese").show().siblings("div").hide();

      $("html, body").animate(
        {
          scrollTop: $("#chinese").offset().top,
        },
        800,
        function () { }
      );
    } else if ($(this)[0].className.search("beverages productClicked") > -1) {
      $("#beverages").show().siblings("div").hide();

      $("html, body").animate(
        {
          scrollTop: $("#beverages").offset().top,
        },
        800,
        function () { }
      );
    }
  });

  $(".menuBtn").click(function () {
    let quantity = $(this).siblings(".quantity");
    let foodNameClicked = quantity
      .parent()
      .siblings("div")
      .children()
      .first()
      .text()
      .trim();
    let foodPrice = Number(
      quantity.parent().siblings("div").children().last().text()
    );

    let count = Number(quantity.text());
    if ($(this)[0].className.search("plus") > -1) {
      count = count + 1;
      quantity.text(count);
      ToCart(foodNameClicked, count, foodPrice, 1);
    } else if ($(this)[0].className.search("minus") > -1) {
      if (count <= 0) {
        quantity.text(0);
      } else {
        count = count - 1;
        quantity.text(count);
        ToCart(foodNameClicked, count, foodPrice, -1);
      }
    }
  });

  var user_name = localStorage.getItem('user_name');
  if (user_name !== null) {
    document.getElementById("customerName").value = user_name;
  }

  let user = localStorage.getItem("user_email");
  let items = user === null ? localStorage.getItem("items") : localStorage.getItem("user_items");
  if (items === null) {
    localStorage.setItem("items", JSON.stringify({}));
    localStorage.setItem("user_items", JSON.stringify({}));
  } else {
    for (const [key, value] of Object.entries(JSON.parse(items))) {
      
      let quantity = $(".quantity").filter((index, element) => {
        return $(element).parent().siblings("div").children().first().text().trim() === key;
      })

      let foodPrice = Number(
        quantity.parent().siblings("div").children().last().text()
      );

      quantity.text(value);

      ToCart(key, value, foodPrice, value);
    }
  }

  document.getElementById("clear_cart").addEventListener("click", function (event) {
    localStorage.setItem('items', JSON.stringify({})); 
    localStorage.setItem('user_items', JSON.stringify({})); 
    set_items();
    location.reload();
  });
});

function ToCart(foodNameClicked, foodQuantity, foodPrice, amountToAdd) {
  let foodAlreadyThere = false;
  let foodPos;
  for (var i = 0; i < food.length; i++) {
    if (food[i][0] === foodNameClicked) {
      foodAlreadyThere = true;
      foodPos = i;
      break;
    } else {
      foodAlreadyThere = false;
    }
  }

  user = localStorage.getItem("user_email");
  items = user === null ? JSON.parse(localStorage.getItem("items")) : JSON.parse(localStorage.getItem("user_items"));
  if (foodQuantity === 0) {
    delete items[foodNameClicked];
  }
  else {
  items[foodNameClicked] = foodQuantity;
  }

  if (user === null) {
  localStorage.setItem("items", JSON.stringify(items));
  } else {
    localStorage.setItem("user_items", JSON.stringify(items));
  }

  set_items();

  if (foodAlreadyThere) {
    food.splice(foodPos, 1);
    food.push([foodNameClicked, foodQuantity, foodPrice]);
  } else {
    food.push([foodNameClicked, foodQuantity, foodPrice]);
  }

  // Remove Food items with quantity = 0
  for (var i = 0; i < food.length; i++) {
    if (food[i][1] === 0) {
      food.splice(i, 1);
    }
  }

  if (food.length !== 0) {
    $(".shoppingCart").addClass("shoppingCartWithItems");

    $(".cartContentDiv").empty();
    for (var i = 0; i < food.length; i++) {
      let cartTxt =
        '<div class="row cartContentRow"><div class="col-10"><div style="display:flex;"><p>' +
        food[i][0] +
        '</p> <p class="text-muted-small">' +
        '<p></div><i class="fa fa-ils"> ' +
        food[i][2] +
        '</i></p>  </div>  <div class="col-2"> <p class="text-muted-small" > <i class="fa fa-ils"></i> ' +
        food[i][1] * food[i][2] +
        '</p>  <span class="cartQuantity"> ' +
        " <span> Qty : </span>" +
        food[i][1] +
        '</span> </div>  </div> <hr class="cartHr">';
      $(".cartContentDiv").append(cartTxt);
    }
  } else {
    $(".shoppingCart").removeClass("shoppingCartWithItems");

    $(".cartContentDiv").empty();
    $(".cartContentDiv").append(
      '<h1 class="text-muted">Your Cart is Empty</h1>'
    );
  }

  $(".shoppingCartAfter").text(food.length);

  if (food.length === 0) {
    totalAmount = 0;
  } else {
    totalAmount = totalAmount + (foodPrice * amountToAdd);
  }

  $(".totalAmountDiv").empty();
  $(".totalAmountDiv").append(
    '<span class="totalAmountText">TOTAL AMOUNT : </span><br/>' +
    '<i class="fa fa-ils"></i> ' +
    totalAmount
  );
}

function openWhatsapp() {
  const customerName = document.getElementById("customerName").value;

  if (customerName === "") {
    document.getElementById("cart_error").hidden=false;
    document.getElementById("error_text").innerHTML = "Customer name cannot be empty. Please try again.";
    return;
  }

  // console.log($('#address'));

  if ($("#address")[0].value === "") {
    document.getElementById("cart_error").hidden=false;
    document.getElementById("error_text").innerHTML = "Please Enter Address";
    return;
  } else {
    document.getElementById("cart_error").hidden=true;

    let total = 0;
    let address = $("#address")[0].value;
    let note = $("#note")[0].value;

    // Calculate the maximum length of the food item names and set a fixed width for the "Name" column
    let maxNameLength = 0;
    for (var i = 0; i < food.length; i++) {
      let name = food[i][0];
      if (name.length > maxNameLength) {
        maxNameLength = name.length;
      }
    }

    const nameColumnWidth = maxNameLength + 5; // Use a fixed width for the "Name" column

    let wTxt = "Name".padEnd(nameColumnWidth) + "Quantity\n";

    for (var i = 0; i < food.length; i++) {
      let name = food[i][0];
      let quantity = food[i][1].toString();
      total = total + food[i][1] * food[i][2];

      // Pad the name with spaces to align it properly
      let nameWithSpaces = name.padEnd(nameColumnWidth, " ");

      // Calculate the number of spaces needed for the "Quantity" column
      let quantitySpaces = nameColumnWidth - nameWithSpaces.length + 5; // Add 5 extra spaces for better alignment

      // Pad the quantity with spaces to align it properly
      let quantityWithSpaces = quantity.padStart(quantitySpaces, " ");

      wTxt = wTxt + nameWithSpaces + quantityWithSpaces + "\n"; // Add the name and quantity to the output
    }

    wTxt =
      wTxt +
      "\n *Total Bill: " +
      total +
      "ILS*" +
      "\n\n Customer Name: " +
      customerName +
      "\n\n Address: " +
      address +
      "\n Note: " +
      note +
      "\n\n Thank you for choosing LaPasta, bon appétit!\n\n" +
      "Visit our website: https://omerbentzi.github.io/La-Pasta-Website.github.io/public/index.html";


    let wTxtEncoded = encodeURI(wTxt);
    window.open("https://wa.me/972584000183?text=" + wTxtEncoded);
    if(localStorage.getItem("user_email") !== null){
      localStorage.setItem('user_items', JSON.stringify({})); 
      set_items();
    } else {
      localStorage.setItem('items', JSON.stringify({}));
    }
    location.reload();
  }
}

function set_items() {
  var email = localStorage.getItem("user_email");
  var items = localStorage.getItem("user_items");

  if (!email) {
    return
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/set_items", true);
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

  var data = "email=" + encodeURIComponent(email) +
    "&items=" + encodeURIComponent(items);

  xhr.send(data);
}