//module wraper function
// (function(module, exports, require, __filname, __dirname ) {

// })
console.log("__fileName = ", __filename)
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  fullName() {
    console.log("my name is", this.name);
  }
  greeting() {
    console.log(`Hello my name is ${this.name} and age is ${this.age}`);
  }
}
module.exports = Person;
