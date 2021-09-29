var xs = [[1, 2, 3], [], ["p", "q"], [], [[], []], [[1], [3], []]];
prueba = [[], []];
var ys = [];

function noEmpty(xs, ys){
    console.log("aqui aqui aqui" + xs[0][0]);
    for(i=0; i<xs.length; i++){
        console.log(xs[i]);
        console.log("i:" + i);
        console.log("largo " + xs[i].length);
        if(i != xs.length){
            if(xs[i].length > 1){
                ys.push(noEmpty(xs[i],ys));
            }else if(xs[i].length == 1){ 
                ys.push(xs[i]);
                console.log("Esto:");
                console.log(ys);
                /*if(){
                    return ys;
                }*/
            }
        }
        if(xs[i] == xs[xs.length-1]){
            return ys;
        }
    }
    console.log(ys);
    return ys;
}

console.log(noEmpty(xs, ys));