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

//bad

promiseAdd(4, 5).then(function(addResult){
    promiseProduct(addResult, 6).then(function(productResult){
        //console.log(productResult);
    })
})

promiseProduct(3, 2).then(function(productResult){
    promiseAdd(productResult, 5).then(function(r){
        //console.log(r);
    })
})

//good

function print(msg, x){
    console.log(msg, x);
    return x;
}

/*promiseAdd(3, 4).then(print.bind(null, "x ="))
.then(result => promiseProduct(result, 2)
.then(print.bind(null, "final = ")))*/

//promiseReduce

const promiseReduce = function(xs, f, init){
    if(xs.length == 0){ //cuando no quedan elementos en el array se devuelve el valor de inicio
        return Promise.resolve(init);
    }
    var [head, ...tail] = xs; //se separan el primer valor del array y el resto
    return f(init, head).then(function(result){ //se le pasan a la función f el primer valor del array y el inicial
        return promiseReduce(tail, f, result); //el resultado se le pasa a promiseReduce como valor inicial (Recursión)      
    });
}


promiseReduce([1, 2, 3], promiseAdd, 0).then(print.bind(null, "Reduce = ")); //6

//promiseCompose

const promiseInc = function(x){
    return promiseAdd(x, 1).then(result => result);
}

const promiseDouble = function(x){
    return promiseProduct(x, 2).then(result => result)
}

const promiseCompose = function(...fs){
    if(fs.length === 0){ //cuando no quedan funciones se devuelve una función que devuelve valor de x
        return function(x){
            return Promise.resolve(x);
        }
    }
    
    let f = fs[fs.length - 1]; //saca la última función del array/conjunto de funciones
    let gs = fs.slice(0, fs.length - 1); //devuelve el conjunto de funciones sin la última
    let g = promiseCompose(...gs); //resto de funciones después de quitar la última

    return function(x){ // Compose devuelve una función que recibirá un parámetro cuando se le llame
        return f(x).then(result => g(result)); //Se le pasa el parámetro x a la última función del array y se le 
                                               //pasa el resultado de f(x) a las siguientes funciones (recursión) 
    };
}

promiseCompose(promiseInc, promiseDouble, promiseDouble)(1).then(print.bind(null, "Compose = ")); //5




/*
const promiseComposePrueba = function(){
    return function(x){
        return promiseInc(x)
    }
}

//promiseComposePrueba()(1).then(result => console.log(result));

const promiseComposeSimple = function(f, g){
    return function(x){        
        return g(x).then(result => f(result));
    };
}

//promiseComposeSimple(promiseInc, promiseDouble)(2).then(result => console.log(result));
*/