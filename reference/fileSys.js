const path = require("path");
const fs = require("fs");

// create folder
// fs.mkdir(path.join(__dirname, "NewText"), (err) => {
//   if (err) throw err;
//   console.log("Folder is created");
// });

// write file using fs.writeFile
fs.writeFile(
  path.join(__dirname, "NewText", "Hello.txt"),
  "This is my first file created using FS.",
  (err) => {
    if (err) throw err;
    console.log("file created successfuly");

    // append file using fs.appendFile
    fs.appendFile(
      path.join(__dirname, "NewText", "Hello.txt"),
      " I love to learning code",
      (err) => {
        if (err) throw err;
        console.log("appingding file");
      }
    );
  }
);
