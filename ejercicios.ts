function sumArray(n: number, aux: number): number{
    return aux += n;
}

function maxNumber(n: number, aux: number): number{
    if(n>aux){
        aux = n;
    }
    return aux;
}

function totalEven(n: number, aux: number): number{
    if(n%2 == 0){
        aux += 1;
    }
    return aux;
}

function reduce(xs: number[], f): number{
    var aux: number = 0;
    for(var i = 0; i<xs.length; i++){
        aux = f(xs[i], aux);
    }
    return aux;
}

console.log(reduce(numbers, sumArray));
console.log(reduce(numbers, maxNumber));
console.log(reduce(numbers, totalEven));