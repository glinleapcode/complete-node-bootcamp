const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

///////////////////
//Files

// synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// const textOut = `This is what we know about avocado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

//Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./txt/final.txt",
//         `${data2}\n\n\n${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("your file has been written to final.txt");
//         }
//       );
//     });
//   });
// });

// console.log("done with files!");

/////////////////////////////////////////////////////
// Server
const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the overview!");
  } else if (pathName === "/product") {
    res.end("This is the product page");
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("page not found");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
