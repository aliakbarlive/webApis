const path = require('path')

const Person = require("./Data/person");
const resolvePath = path.basename(__filename);

const personIntro = new Person("johan", 40);
personIntro.greeting();
personIntro.fullName();
console.log(resolvePath)
