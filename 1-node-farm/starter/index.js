const fs = require("fs");

const textIn = fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
  console.log(data);
});

const textOut = `This is what we know about avocado: ${textIn}. \nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");
