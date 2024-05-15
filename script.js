var token = "";

const owner = "shoebham";
const lambdaUrl =
  "https://dngqvawgx4ao3debwj3u5t7bmu0kqxpc.lambda-url.us-east-1.on.aws/";
const repo = "concurrent-counter";
const path = "data.json";
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
var sha = "";
let names = ["shubham", "tyagi", "tanuj"];
let localdata = { shubham: 0, tyagi: 0, tanuj: 0 };

function readJson() {
  fetch(
    "https://raw.githubusercontent.com/shoebham/concurrent-counter/main/data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Json data", data);
      setup("shubham", data["shubham"]);
      setup("tyagi", data["tyagi"]);
      setup("tanuj", data["tanuj"]);

      let savebtn = document.createElement("button");
      savebtn.textContent = "save";
      savebtn.id = "save";

      savebtn.addEventListener("click", () => {
        console.log("saved");
        savebtn.disabled = true;
        save();
      });
      let body = document.getElementsByTagName("body")[0];
      body.appendChild(savebtn);
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
  counter.id = `${nameText}-counter`;
  counter.textContent = cntText;

  let name = document.createElement("p");
  name.id = nameText;
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

function updateLocal() {
  localdata["shubham"] = document.getElementById("shubham-counter").textContent;
  localdata["tyagi"] = document.getElementById("tyagi-counter").textContent;
  localdata["tanuj"] = document.getElementById("tanuj-counter").textContent;
}

function save() {
  // Event listener for save button
  // Convert counters object to JSON string
  updateLocal();
  const jsonData = JSON.stringify(localdata, null, 2);
  console.log("jsonData", jsonData, "localdata", localdata);
  const encodedData = btoa(unescape(encodeURIComponent(jsonData)));

  // Make API request to update file in GitHub repository
  const url = apiUrl;
  fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update counter values",
      content: encodedData, // Encode data to base64
      sha: sha,
    }),
  })
    .then((response) => {
      if (response.ok) {
        sha = getSHA();
        document.getElementById("save").disable = false;
        alert("Counter values saved successfully!");
      } else {
        alert("Failed to save counter values.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while saving counter values.");
    });
}

async function setToken() {
  try {
    const response = await fetch(lambdaUrl, {
      method: "GET",
      mode: "cors", // This should be 'cors' for cross-origin requests
    });
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.text();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getSHA() {
  try {
    token = await setToken();
    token = token.replace(/"/g, "");
    console.log("Token", token);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    const currentSha = data.sha;
    sha = currentSha;
    console.log("Current SHA of the file:", currentSha);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
// names.forEach((name) => {
//   setup(name);
// })
// setToken();
getSHA();
readJson();
