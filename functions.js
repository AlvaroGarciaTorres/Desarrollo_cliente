//Function some()

var numbers = [1, 2, 3, 5];

function isEven(n){
    return n%2 == 0 ? true : false;
}

function some(xs, f){
    for(var i = 0; i<xs.length; i++){
        if(f(xs[i])){
            return true;
        }
    //if (bool == true) break;
    }
    return false;
}

console.log(some(numbers, isEven));

//Function every()

function every(xs, f){
    for(var i = 0; i<xs.length; i++){
        if(!f(xs[i])){
            return false;
        }
    }    
    return true;
}

console.log(every(numbers, isEven));

//Function flat()

/*
Intento de hacerlo iterando
var test = [1, 3 , [2, 5] , [2]];
console.log(test[0]);
function flat(xs){
    var ys = [];
    for(var i = 0; i<xs.length; i++){
        if(Array.isArray(xs[i])){
            ys = ys.concat(xs[i]);
        } else ys.push(xs[i]);  
    }
    return ys;
}

console.log(flat(test));
*/

var test = [1, 3 , [2, 5, [2]] , [2]];


function flat(xs){
    if(xs.length === 0){
        return [];
    }
    var [head, ...tail] = xs;
    return (Array.isArray(head)) ? flat(head).concat(flat(tail)): [head].concat(flat(tail));
}

console.log(flat(test));

//Function flatMap() 

function arrayOfDouble(n){
    return [n*2];
}

function flatMap(xs, f) {
    ys = [];
    for(var i = 0; i<xs.length; i++){
        ys.push(f(xs[i]).pop());
    } 
    return ys;
}

console.log(flatMap(numbers, arrayOfDouble));

//Reduce recursivo

function sumArray(acc, n){
    return acc + n;
}

function reduce_recur(xs, f, init){
    if(xs.length === 0){
        return init;
    }
    var [head,...tail] = xs;
    return f(reduce_recur(tail, f, init), head);
}

console.log(reduce_recur(numbers, sumArray, 0));