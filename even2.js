
var numbers = [1, 3, 4, 5, 8];

function even(ns){
    var ys = [];
    for(i=0; i<ns.length; i++){
        if(ns[i]%2 == 0){
            ys.push(ns[i]);
        }
    }
    return ys;
}

console.log(even(numbers));