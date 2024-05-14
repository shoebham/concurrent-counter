let names = ["shubham", "tyagi", "tanuj"];
let localdata = { shubham: 0, tyagi: 0, tanuj: 0 };
function readJson() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      setup("shubham", data["shubham"]);
      setup("tyagi", data["tyagi"]);
      setup("tanuj", data["tanuj"]);

      let savebtn = document.createElement("button");
      savebtn.textContent = "save";
      savebtn.id = "save";

      savebtn.addEventListener("click", () => {
        console.log("saved");
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

const token =
  "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";
const owner = "shoebham";
const repo = "concurrent-counter";
const path = "data.json";
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
var sha = "";

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

function getSHA() {
  fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const currentSha = data.sha;
      sha = currentSha;
      console.log("Current SHA of the file:", currentSha);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// names.forEach((name) => {
//   setup(name);
// });

getSHA();
readJson();
