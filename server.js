const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'))

// app.get("/", (req, res) => {
//   // res.send("<h1>This is home page</h1>");
//   // res.json({mesg: 'This is json'})

//   // to get client header info
//   const head = req.header("host");
//   const userAgent = req.header("user-agent");
//   // to get all header in arr
//   const rawHeader = req.rawHeaders;
//   res.send(rawHeader);
// });

app.post("/contact", (req, res) => {
  if (!req.body.name) {
    return res.status(400).send("Name is required");
  }
  res.status(201).send(`Thank you ${req.body.name}`);
});

// login auth using x-auth-token header
app.post("/login", (req, res) => {
  if (!req.header("x-auth-token")) {
    return res.status(400).send("NO Token");
  }
  if (req.header("x-auth-token") !== "12345") {
    return res.status(401).send("Not Authorize");
  }
  res.send("Logged In");
});

// to update the data
app.put('/post/:id', (req, res) =>{
  res.json({
    id: req.params.id,
    title: req.body.title
  })
})

// to delete the data 
app.delete('/post/:id', (req, res) =>{
  res.json({
    mesg: `The id ${req.params.id} is deleted `
  })
})

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
