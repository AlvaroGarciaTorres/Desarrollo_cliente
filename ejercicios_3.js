var numbers = [1,3,5];

function adults(n){
    if(n>=18){
        return n;
    }
}

//Implementación de un filter recursivo: 

function filter_recur(xs, f) {
    if (xs.length === 0){
        return [];
    } 
    return f(xs[0]) ? [f(xs[0])].concat(filter_recur(xs.slice(1), f)) : [].concat(filter_recur(xs.slice(1), f));   
}

console.log(filter_recur([18, 23, 3, 42, 17], adults));





//Implementación de la función map con reduce:

function incNumber(n){
    return n+=1;
} 
function map(ns, f){
    ys = [];
    for(i=0; i<ns.length; i++){
        ys.push(f(ns[i]));
    }
    return ys;
}

function sumArray(n, acc){
    return acc + n;
}
function reduce(xs, f, init){
    var acc = init;
    for(var i = 0; i<xs.length; i++){
        acc = f(xs[i], acc);
    }
    return acc;
}

function map_reduce(xs, f){
    return [reduce(xs, f, [])]
}



console.log(map_reduce([1,2,3], incNumber));