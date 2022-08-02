const path = require("path");

// file basename 
console.log(path.basename(__filename))

//  directory address 
console.log(path.dirname(__dirname))

// file address without extension
console.log(path.dirname(__filename))

//file extension
console.log(path.extname(__filename))

// concatination path 
console.log(path.join(__dirname, 'test', 'server'))

//toNamespace path return the complete address with file name and ext.
console.log(path.toNamespacedPath(__filename))

//seperate path and return parts of path in arr of string
console.log(__filename.split(path.sep))

//create a path object using parse
console.log(path.parse(__filename))


