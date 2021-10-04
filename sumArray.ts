var numbers = [1, 2, 3];

function sumArray(xs: number[]): number{
    var sum: number = 0;
    for(var i = 0; i<xs.length; i++){
        sum += xs[i];
    }
    return sum;
}

console.log(sumArray(numbers));