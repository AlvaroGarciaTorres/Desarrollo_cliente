
var numbers = [1,3,5];

function incNumber(n){
    return n+=1;
} 

function inc(ns){
    var ys = [];
    for(i=0; i<ns.length; i++){
        ys.push(ns[i] += 1);
    }
    return ys;
}

function map(ns, f){
    var ys = [];
    for(i=0; i<ns.length; i++){
        ys.push(f(ns[i]));
    }
    return ys;
}

console.log(inc(numbers));
console.log(map(numbers,incNumber));

