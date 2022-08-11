const express = require("express");
const app = express();
const PORT =  5000;

app.get("/", (req, res) => {
  res.send("this is home page");
});

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
