var numbers = [1,2,3];

var triple = (numbers) =>{
    var result = [];
    for(var i=0; i<numbers.length; i++){
        result.push(numbers[i]*3);
    }
    return result;
}

console.log(triple(numbers));