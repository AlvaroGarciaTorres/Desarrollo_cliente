var numbers = [];
var limit = 20;

for(i=1; i<=limit; i++){
    numbers.push(i);
}

var isEven = (numbers) =>{
    var result = [];
    for(i=0; i<=numbers.length; i++){
        /*if((numbers[i]%2) == 0){
            result.push(true);
        }else {
            result.push(false);
        }*/
        result.push((numbers[i]%2) == 0);
    }
    return result;
}

console.log(isEven(numbers));