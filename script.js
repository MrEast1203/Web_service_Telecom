document.getElementById("addUserForm").onsubmit = function (e) {
  e.preventDefault();

  // Get form data
  const user_did = document.getElementById("user_did").value;
  const phone_number = document.getElementById("phone_number").value;
  const plan = document.getElementById("plan").value;
  const provider = document.getElementById("provider").value;
  //   console.log(phone_number, user_name, plan, provider);
  // Send POST request to Flask server
  fetch("http://127.0.0.1:5000/add_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_did, phone_number, plan, provider }),
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
  const user_did = document.getElementById("search_user_did").value;

  // Send GET request to Flask server
  fetch("http://127.0.0.1:5000/get_VC/" + user_did)
    .then((response) => {
      //   console.log(response.ok);
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.json();
    })
    .then((data) => {
      // Display the search results
      const resultsDiv = document.getElementById("searchResults");
      resultsDiv.innerHTML = `
          <p>Name: ${data.user_did}</p>
          <p>Phone Number: ${data.hashed_phone_number}</p>
          <p>Plan: ${data.plan}</p>
          <p>Provider: ${data.provider}</p>
          <p>signature: ${data.signature}</p>
      `;
    })
    .catch((error) => {
      // Handle errors (e.g., user not found)
      document.getElementById("searchResults").innerHTML = error.message;
    });
};
document.getElementById("get_did").onclick = function (e) {
  e.preventDefault();
  console.log("get_did");
  fetch("http://127.0.0.1:5000/get_did", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      const resultsDiv = document.getElementById("did");
      resultsDiv.innerHTML = `
          <p>did: ${data}</p>
      `;
      // Handle response data
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
document.getElementById("verifyVCForm").onsubmit = function (e) {
  e.preventDefault();

  // Get form data
  const user_did = document.getElementById("verify_user_did").value;
  const phone_number = document.getElementById("verify_phone_number").value;
  const plan = document.getElementById("verify_plan").value;
  const provider = document.getElementById("verify_provider").value;
  const signature = document.getElementById("verify_signature").value;
  //   console.log(phone_number, user_name, plan, provider);
  // Send POST request to Flask server
  fetch("http://127.0.0.1:5000/verify_VC", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_did, phone_number, plan, provider, signature }),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      const resultsDiv = document.getElementById("verify_results");
      resultsDiv.innerHTML = `
          <p>Verified: ${data}</p>
      `;
      // Handle response data
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
