const fs = require("fs");

const textIn = fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
  console.log(data);
});
