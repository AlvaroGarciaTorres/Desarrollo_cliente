var numbers = [1, 3, 4, 2];

/*function sumArray(xs){
    var x = 0;
    for(var i = 0; i<xs.length; i++){
        x += xs[i];
    }
    return x;
}

console.log(sumArray(numbers));

function maxNumber(xs){
    var max_number = xs[0];
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
    return aux + n;
}

function maxNumber(n, aux){
    return n > aux ? n : aux;
}

function totalEven(n, aux){
    return n%2 == 0 ? aux + 1 : aux;
    
}

function reduce(xs, f, init){
    var acc = init;
    for(var i = 0; i<xs.length; i++){
        acc = f(xs[i], acc);
    }
    return acc;
}

console.log(reduce(numbers, sumArray, 0));
console.log(reduce(numbers, maxNumber, numbers[0]));
console.log(reduce(numbers, totalEven, 0));