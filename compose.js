var inc = (x) => x + 1;
var triple = (x) => x * 3;
var double = (x) => x * 2;
var triple_then_inc = (x) => inc(triple(x));

var triple_then_inc_steps = function (x) {
    var y = triple(x);
    var z = inc(y);
    return z;
} 

console.log(inc(triple(5)));
console.log(triple_then_inc(5));

//Function compose

var compose = function(f, g){
    return (x) => f(g(x));
}

var triple_then_inc_compose = compose(inc, triple);
console.log(triple_then_inc_compose(5));

console.log(compose(triple, (compose(inc, double)))(7));

//Crear multicompose
//el multicompose es en realidad el compose normal

id = (x) => x;

function multicompose(...fs){ //Esto indica que se van a recibir muchas cosas que se almacenarán como un array
    fs = [...fs, id]; //si el array está vacío cuando te lo pasan no ejecutas nada, devuelves lo que te pasen.
    return function (x){
        for(var i = fs.length -1; i>=0; i--){
            f = fs[i];
            x =f(x);
        }
        return x;
    }
}

console.log(multicompose(triple, inc, double)(7));
console.log(multicompose()(7)) //devuelve 7 porque no le has pasado funciones

//Function pipe()

/*function pipe(...fs){
    fs = [...fs, id];
    return function(x){
        for (var i = 0; i<fs.length; i++){
            f = fs[i];
            x = f(x);
        }
        return x;
    }
}*/

var pipe = (...fs) => multicompose(...fs.reverse()); //en realidad debería ser compose (multicompose es compose realmente)

console.log(pipe(double, inc, triple)(2));