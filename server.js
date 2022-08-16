const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile(path.join(__dirname, "public", "Home.html"), (err, content) => {
      if (err) throw err;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    });
  }

  // if (req.url === "/api/user") {
  //   const users = [
  //     {
  //       id: "1",
  //       name: "ali",
  //     },
  //     {
  //       id: "1",
  //       name: "ali",
  //     },
  //   ];
  //   res.writeHead(200,{'Content-Typpe':'application/json'})
  //   res.end(JSON.stringify(users))
  // }

  // build fil path
  const filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "Home.html" : req.url
  );

  //  get the file extension
  const extName = path.extname(filePath);

  // initial content-type
  let contentType = "text/html";

  switch (extName) {
    case ".js":
      contentType = "application/js";
    case ".json":
      contentType = "application/json";
    case '.png':
      contentType= 'image/png'
    case ".css":
      contentType = "text/css";
      break;
  }
  // Read file
  fs.readFile(path.join(filePath), (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Page not found
        fs.readFile(
          path.join(__dirname, "public", "404.html"),
          (err, content) => {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf8");
          }
        );
      } else {
        // some server error
        res.writeHead(500);
        res.end(`server error ${err.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });
});

server.listen(PORT, () => console.log("server is running on port", PORT));
