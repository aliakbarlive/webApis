class Person {
    constructor(name, age){
        this.name = name
        this.age = age
    }
    greeting(){
        console.log( `Hello my name is ${this.name} and age is ${this.age}`)
    }

}
module.exports = Person