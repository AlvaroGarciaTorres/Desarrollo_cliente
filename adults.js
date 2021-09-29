var ages = [18, 30, 4, 51, 6];

function adults(ns){
    var ys = [];
    for(i=0; i<ns.length; i++){
        if(ns[i]>=18){
            ys.push(ns[i]);
        }
    }
    return ys;
}

console.log(adults(ages));