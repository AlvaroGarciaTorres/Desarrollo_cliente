
function product(x){
    return function(y){
        return x * y;
    }
}

console.log(product(3)(7));

var double = product(2);
var triple = product(3);

console.log(double(3), triple(7));