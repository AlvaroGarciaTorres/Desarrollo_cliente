var numbers = [18, 30, 4, 51, 6, 111, 131131];

function adults(n){
    if(n>=18){
        return n;
    }
}

function even(n){
    if(n%2 == 0){
        return n;
    }    
}

function palindrome(n){
    var aux_str = "";
    if(Number.isInteger(n)){
        n = n.toString();
    }
    for(j=n.length-1; j>=0; j--){
        aux_str += n[j];
    }
    return n == aux_str;
}

function map(ns, f){
    ys = [];
    for(i=0; i<ns.length; i++){
        ys.push(f(ns[i]));
    }
    return ys;
}

function filter(ns, f){
    ys = [];
    for(var i=0; i<ns.length; i++){
        if(f(ns[i])){
            ys.push(f(ns[i]));
        }       
    }
    return ys;
}

console.log(map(numbers, even));
console.log(filter(numbers, even));