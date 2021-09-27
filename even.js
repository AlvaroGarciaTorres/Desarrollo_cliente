numbers = [];
limit = 20;

for(i=1; i<=limit; i++){
    numbers.push(i);
}

isEven = (numbers) =>{
    result = [];
    for(i=0; i<=numbers.length; i++){
        if((numbers[i]%2) == 0){
            result.push(true);
        }else {
            result.push(false);
        }
    }
    return result;
}

console.log(isEven(numbers));