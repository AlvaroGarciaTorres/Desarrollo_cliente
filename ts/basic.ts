function product(x:number){
    return function(y:number){
        return x * y;
    }
}

console.log(product(3)(7));

var double = product(2);
var triple = product(3);

console.log(double(3), triple(7));

/*var product = x => y => x * y;*/

function curry2<A, B, C>(f: (x: A, y: B) => C): (x:A) => (y: B) => C {
    return function(x){
        return function(y){
            return f(x,y);
        }
    }
}

function curry2<A, B, C>(f: (x: A, y: B) => C): (x:A) => (y: B) => C {
    return x => y => f(x,y);
}