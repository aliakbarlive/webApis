const http = require("http");

http
  .createServer((req, res) => {
    res.write("This is my server");
    res.end();
  })
  .listen(5000, () => console.log("server is running"));
