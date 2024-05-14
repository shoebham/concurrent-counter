let names = ["shubham", "tyagi", "tanuj"];
let localdata = { shubham: 0, tyagi: 0, tanuj: 0 };
function readJson() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      setup("shubham", data["shubham"]);
      setup("tyagi", data["tyagi"]);
      setup("tanuj", data["tanuj"]);

      let save = document.createElement("button");
      save.textContent = "save";
      save.id = "save";

      let body = document.getElementsByTagName("body")[0];
      body.appendChild(save);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function setup(nameText, cntText) {
  let plus = document.createElement("button");
  plus.id = "plus";
  plus.textContent = "+";
  let minus = document.createElement("button");
  minus.id = "minus";
  minus.textContent = "-";
  let counter = document.createElement("p");
  counter.id = "counter";
  counter.textContent = cntText;

  let name = document.createElement("p");
  name.id = "name";
  name.textContent = nameText;

  let div = document.createElement("div");
  div.id = "container";
  localdata[nameText] = cntText;

  let body = document.getElementsByTagName("body")[0];

  plus.addEventListener("click", (e) => {
    counter.textContent = Number(counter.textContent) + 20;
    localdata[nameText] = counter.textContent;
  });

  minus.addEventListener("click", (e) => {
    counter.textContent = Number(counter.textContent) - 20;
    localdata[nameText] = counter.textContent;
  });
  div.appendChild(name);
  div.appendChild(counter);
  div.appendChild(plus);
  div.appendChild(minus);
  body.appendChild(div);
}

function save() {
  // Event listener for save button
  document.getElementById("save").addEventListener("click", () => {
    // Convert counters object to JSON string
    const jsonData = JSON.stringify(localdata, null, 2);
    // Make API request to update file in GitHub repository
    const url =
      "https://api.github.com/repos/username/repository/contents/data.json";
    const token = "your_personal_access_token";

    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update counter values",
        content: btoa(jsonData), // Encode data to base64
        sha: "current_sha_of_file",
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Counter values saved successfully!");
        } else {
          alert("Failed to save counter values.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while saving counter values.");
      });
  });
}
// names.forEach((name) => {
//   setup(name);
// });

readJson();
