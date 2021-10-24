var a = [1, 2,, 3]; //los arrays pueden tener agujeros

console.log("1" in a); //true pregunta si la clave está en el array

console.log("2" in a); //false es donde está el agujero

console.log(a.length); //4 

var a = [1, 2, 3, 4, 5, 6]; //array denso

delete a[3];

console.log("3" in a); //false

console.log(a); //[ 1, 2, 3, <1 empty item>, 5, 6 ]

a.splice(3, 2) //ELimina una o varias claves sin dejar un hueco 
               //(en esete caso desde la posición 3 borra dos claves)

console.log(a) //[ 1, 2, 3, 6 ]

a.splice(1, 2, "a", "b"); //se le pueden añadir más parámetros para sustituir unos elmentos por otros

console.log(a) //[ 1, 'a', 'b', 6 ]

//Cuidado porque splice es destructivo. Slice no lo es.

//EN js hacen distinción entre tipos primitivos y objetos:

console.log(typeof "Peter"); //string

console.log(typeof new String("Peter")); //object

console.log(new String("Peter") == new String("Peter")); //false porque se compara por 
                                                         //referencias al ser objetos


console.log(new String("Peter") == "Peter"); // true con == hace casting

//Las funciones nunca se pueden igualar, una funcion nunca es igual a otra. A si misma si.

a = (x) => x;

console.log(a == a) //true

//Los valores primitivos tienen metodos :

console.log("Peter".toUpperCase()); //PETER internamente hace una especie de casting a objeto

var person1 = {
    name: "Peter",
    greet: function(){
        return "Hi " + this.name;
    }
}

var person2 = {
    name: "Ann",
    greet: function(){
        return "Hi " + this.name;
    }
}

console.log(person1.greet()); //Hi Peter
console.log(person2.greet()); //Hi Ann

//la funcion está repetida, malo

//Posibles soluciones:

greet = function(person){
    return "Hi " + person.name; //Hay que cambiarlo porque si no this es el objeto global
}

var person1 = {
    name: "Peter"
}

var person2 = {
    name: "Ann"
}

console.log(greet(person1));
console.log(greet(person2));

//Otra solucion:

//this es mutable, se puede cambiar quién es

greet = function(){
    return "Hi " + this.name;
}

var person1 = {
    name: "Peter"
}

var person2 = {
    name: "Ann"
}

console.log(greet(person1)); //Hi undefined
                             //así this es el objeto global porque this es el objeto que 
                             //llama al método y en este caso nadie ha llamado a greet

//Posible solución:

person1.greet = greet; //se crea el atributo greet que es la funcion greet

console.log(person1.greet()) //Hi Peter Aquí es person1 quien llama a greet, person1 es el this

//Otra opción equivalente:

var person2 = {
    name: "Ann",
    greet: greet //es lo mismo que person2.greet = greet;
}

console.log(person2.greet());

console.log(person1.greet === person2.greet); //true Importante para más adelante
                                              //Son la misma función

//CUIDADO: en las arrow function el this es siempre el global, es estática

//Duck typing:

var person3 = {
    name: "Rose"
}

//La funciones en js tienen metodos

console.log(greet.call(person3)); //Hi Rose se puede hacer sin que tenga la funcion greet:
                                  //call es un metodo de funcion que permite llamar a una funcion.
                                  //el primer parámetro de call es el objeto this

greet = function(greeting){
    return greeting + " " + this.name;
}

person1.greet = greet; //Lo hago para que guarde el nuevo greet modificado, si no mantiene la anterior

console.log(person1.greet("Bye")); //Bye Peter

console.log(greet.call(person3, "Good morning")); //Good morning Rose
                                                  //Así le paso parámetros a la funcion usando call,
                                                  //primero objeto this y luego los parámetros

//.apply hace lo mismo que call, pero los parámetros se pasan como array

console.log(greet.apply(person3, ["Good morning"])); //Good morning Rose

//.bind no llama a la funcion, crea una funcion para que luego la llames

var kk = greet.bind(person3, "Good morning"); //esta funcion ya tiene asociado su objeto this (person3)

console.log(kk()); //Good morning Rose

var kk = greet.bind(person3);

console.log(kk("Good morning")); //Good morning Rose
                                 //Se le pueden pasar después los parametros cuando usamos bind
                                 //bind hace una aplicación parcial de parámetros (currificar)

//Como usar map con un objeto

var kk = {
    0: "a",
    1: "b",
    2: "c",
    length: 3
}

console.log([].map.call(kk, x => x.toUpperCase())); //primero hago map de un array vacío para usar su método map, 
                                                    //porque map solo funciona con arrays
                                                    //call define el this, que será kk (un objeto)
                                                    //map no comprueba si es un pbeto o no, solo necesita una propiedadlength
                                                    //Esto es un pseudoarray, un objeto que se comporta como un array

//Esto es duck typing, una alternativa a la herencia. Es un tipo de herencia en la que no se declaran clases,
//"camino como un pato, nado como un pato y sueno como un pato, entonces es que soy un pato"
//Si tienes estas propiedades yo las puedo aplicar: en el caso array neceistas indices consecutivos y una
//propiedad length, cosas que tiene el objeto kk.


//Como podemos hacer privados los atributos

function createPerson(name){
    return {
        greet: function(){
            return "Hi " + name + "!";
        }
    }
}

var person1 = createPerson("Peter");
var person2 = createPerson("Ann");;

console.log(person1.greet()); //Hi Peter!
console.log(person2.greet()); //Hi Ann!

console.log(person1.name); //undefined

//Ventaja: no repito código porque la función está en un solo sitio.
//Problema: es ineficiente porque las funciones de person1 y person2 no son las mismas, ocupan mucho espacio de memoria

console.log(person1.greet == person2.greet) //false Esto da el problema de memoria

//Prototipos y constructores

function Person(name){
    this.name = name;

    this.greet = function(){
        return "Hi " + name + "!";
    }
}

var person1 = new Person("Peter"); //Hi Peter!
                                   //Si llamas a una función con el operador new ocurren dos cosas:
                                   //1. El objeto this cambia y se convierte en el objeto nuevo
                                   //2. Por defecto si no retornas nada, retorna this
                                   //Si pones otro return devolverá lo del return que hayas puesto

//console.log(person1.greet());

var person1 = Person("Peter"); //Al no poner new se le asigna el name a global

console.log(greet()); //Hi Peter!
                      //En este caso el objeto del this es el global, al que antes hemos asignado un name

//Simular el comportamiento de new sin usarlo:

function Person(name){
    this.name = name;

    this.greet = function(){
        return "Hi " + name + "!";
    };

    return this;
}

var person1 = Person.call({}, "Peter"); 
var person2 = Person.call({}, "Ann"); 

//console.log(person1.greet()); //Hi Peter!
//console.log(person2.greet()); //Hi Ann!

//Está map en arrays?

console.log("map" in []); //true

console.log(Object.keys([])); //[] no tiene claves

//Esto es posible porque las funciones en js es un objeto con metodos y tb tienen atributos.
//Uno de los atributos que tienen las funciones es prototype, que es un objeto.

function Person(name){
    this.name = name;

    this.greet = function(){
        return "Hi " + this.name + "!";
    }
}

var person1 = new Person("Peter");
var person2 = new Person("Ann");
//console.log(person1.greet()); //Hi Peter!

console.log(person1.greet == person2.greet); //false Son dos funciones diferentes, problema de memoria otra vez

//Solución: usar prototipos


function Person(name){
    this.name = name;
}

Person.prototype.greet = function(){ //ponemos greet en el prototipo de la función Person en vez de en Person
    return "Hi " + this.name + "!";
}

var person1 = new Person("Peter");
console.log(person1.greet()); //Hi Peter!

var person2 = new Person("Ann");
//console.log(person2.greet()); //Hi Ann!

console.log(person1.greet == person2.greet); //true

//Prototype es un objeto y puede tener a su vez atributos
//Cuando buscas un objeto.algo lo primero que hace es buscar esa clave en el objeto this.
//Si no lo encontrara, mira la función constructora del objeto y busca en el prototipo de la funcion constructora.
//Si no lo encontrara, lo buscaria en el prototipo de la funcion constructora del prototipo (en muchos casos object, que es el ancentro común de todos los objetos).
//El problema de usar prototype es que los atributos no pueden hacerse privados, pero consigue un mejor aprovechamiento de la memoria

var kk = {
    0: "a",
    1: "b",
    2: "c",
    length: 3
}

console.log(Array.prototype.map.call(kk, x => x.toUpperCase())); //Esto se podría haber hecho así

//Método create: Object.create()







                                        



