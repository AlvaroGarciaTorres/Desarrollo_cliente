var numbers = [1, 3, 4, 2];

/*function sumArray(xs){
    var sum = 0;
    for(var i = 0; i<xs.length; i++){
        sum += xs[i];
    }
    return sum;
}

console.log(sumArray(numbers));

function maxNumber(xs){
    var max_number = 0;
    for(var i = 0; i<xs.length; i++){
        if(xs[i]>max_number){
            max_number = xs[i];
        }
    }
    return max_number;
}

console.log(maxNumber(numbers));

function totalEven(xs){
    var sum = 0;
    for(var i = 0; i<xs.length; i++){
        if(xs[i]%2 == 0){
            sum += 1;
        }
    }
    return sum;
}

console.log(totalEven(numbers));*/

function sumArray(n, aux){
    return aux += n;
}

function maxNumber(n, aux){
    if(n>aux){
        aux = n;
    }
    return aux;
}

function totalEven(n, aux){
    if(n%2 == 0){
        aux += 1;
    }
    return aux;
}

function reduce(xs, f){
    var aux = 0;
    for(var i = 0; i<xs.length; i++){
        aux = f(xs[i], aux);
    }
    return aux;
}

console.log(reduce(numbers, sumArray));
console.log(reduce(numbers, maxNumber));
console.log(reduce(numbers, totalEven));