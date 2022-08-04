const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1 style='color:blue'> Home Page  </h1>");
  }
  console.log("req.ulr", req.url);
});

server.listen(PORT, () => console.log("server is running on port", PORT));
