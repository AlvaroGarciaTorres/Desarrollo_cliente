var numbers = [18, 30, 4, 51, 6];

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

function map(ns, f){
    ys = [];
    for(i=0; i<ns.length; i++){
        ys.push(f(ns[i]));
    }
    return ys;
}

console.log(map(numbers, even));