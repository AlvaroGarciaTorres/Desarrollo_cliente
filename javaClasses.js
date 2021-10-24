//Azúcar sintáctico: forma más sencilla de programar

class Person{
    constructor(name){
        this.name = name;
    }

    greet(){
        return "Hi " + this.name;
    }
}

class Student extends Person{
    constructor(name, subjects){
        super(name);
       this.subjects = subjects; 
    }

    signin(){
        return "Signed!";
    }
}

var person1 = new Person("Peter");
var person2 = new Person("Ann");

console.log(person1.greet()); //Hi Peter
console.log(person2.greet()); //Hi Ann

console.log(person1.greet == person2.greet); //true

console.log("greet" in Person.prototype); //true Internamente esto funciona como si se trabajara con prototipos

var student1 = new Student("Rose", ["Sistemas, BBBDD"]);

console.log(student1.signin());
console.log(student1.greet()); //lo hereda de Person llamanando a super, es obligado poner super

console.log(person1.greet == student1.greet); //true se aprovecha la memoria cuando se hereda también