let numbers = [1,2,3];

triple = (numbers) =>{
    result = [];
    for(var i=0; i<numbers.length; i++){
        result.push(numbers[i]*3);
    }
    return result;
}

console.log(triple(numbers));