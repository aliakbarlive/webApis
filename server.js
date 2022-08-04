const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;
const server = http.createServer((req, res) => {
  if(req.url === '/'){
    res.end('<h1> Home page </h1>')
  }
});

server.listen(PORT, () => console.log('server is running on port',PORT ));
