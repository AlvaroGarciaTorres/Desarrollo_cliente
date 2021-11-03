const p = new Promise(function(resolve, reject){
    setTimeout(function(){
        resolve(4);
       //console.log(p);
    }, 1000)
});

p.then(function(result){
    //console.log(result);
})

//Promise add

const promiseAdd = function(x, y) {
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve(x + y);
        }, 10);
    })
}

promiseAdd(4, 5).then(function(result){
    //console.log(result);
});

//Promise Product

const promiseProduct = function(x, y){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve(x * y);
        }, 10)
    })
}

promiseProduct(3, 4).then(function(result){
    //console.log(result);
})

//(4+5) * 6

promiseAdd(4, 5).then(function(addResult){
    promiseProduct(addResult, 6).then(function(productResult){
        console.log(productResult);
    })
})

promiseProduct(3, 2).then(function(productResult){
    promiseAdd(productResult, 5).then(function(r){
        console.log(r);
    })
})