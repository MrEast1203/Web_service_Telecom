document.getElementById("addUserForm").onsubmit = function (e) {
  e.preventDefault();

  // Get form data
  const phone_number = document.getElementById("phone_number").value;
  const user_name = document.getElementById("user_name").value;
  const plan = document.getElementById("plan").value;
  const provider = document.getElementById("provider").value;
  //   console.log(phone_number, user_name, plan, provider);
  // Send POST request to Flask server
  fetch("http://127.0.0.1:5000/add_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone_number, user_name, plan, provider }),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      // Handle response data
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
document.getElementById("print").onclick = function (e) {
  e.preventDefault();
  console.log("print");
  fetch("http://127.0.0.1:5000/print_database", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      // Handle response data
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
document.getElementById("findUserForm").onsubmit = function (e) {
  e.preventDefault();

  // Get the username from the input field
  const user_name = document.getElementById("search_user_name").value;
  const phone_number = document.getElementById("search_phone_number").value;

  // Send GET request to Flask server
  fetch("http://127.0.0.1:5000/get_provider/" + phone_number + "/" + user_name)
    .then((response) => {
      //   console.log(response.ok);
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.text();
    })
    .then((data) => {
      // Display the search results
      const resultsDiv = document.getElementById("searchResults");
      resultsDiv.innerHTML = `<p>Provider: ${data}</p>`;
      // resultsDiv.innerHTML = `
      //     <p>Name: ${data.user_name}</p>
      //     <p>Phone Number: ${data.hashed_phone_number}</p>
      //     <p>Plan: ${data.plan}</p>
      //     <p>Provider: ${data.provider}</p>
      // `;
    })
    .catch((error) => {
      // Handle errors (e.g., user not found)
      document.getElementById("searchResults").innerHTML = error.message;
    });
};
