var numbers = [111, 121, 1331, 12, 190091]; 

function palindrome(xs){
    var ys = [];
    
    for(i=0; i<xs.length; i++){
        var aux_str = "";
        if(Number.isInteger(xs[i])){
            xs[i] = xs[i].toString();
        }
        for(j=xs[i].length-1; j>=0; j--){
            aux_str += xs[i][j];
        }
        if(xs[i] == aux_str){
            xs[i] = parseInt(xs[i]);
            ys.push(xs[i]);
        }
    }
    return ys;
}

function palindrome(n){
    var aux_str = "";
    if(Number.isInteger(n)){
        n = n.toString();
    }
    for(j=n.length-1; j>=0; j--){
        aux_str += n[j];
    }
    if(n == aux_str){
        return n;
        }
}

const convertAndReverse = number.toString()

console.log(palindrome(numbers));