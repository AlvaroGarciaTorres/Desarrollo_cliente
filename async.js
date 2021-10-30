
function add(x, y) {
    return x + y;
}


function asyncAdd(x, y, cbk) {
    setTimeout(function () {
        cbk(x + y);
    }, Math.floor(Math.random() * 50) + 50);
}

function asyncProduct(x, y, cbk) {
    setTimeout(function () {
        cbk(x * y);
    }, Math.floor(Math.random() * 50) + 50);
}

/*asyncAdd(5, 6, function (result) {
    console.log(result);
});

asyncProduct(6, 8, function (result) {
    console.log(result);
});

asyncAdd(2, 3, function(sum){
    asyncProduct(sum, 4, function(product){
        console.log(product);
    })
})

asyncProduct(3, 4, function (product) {
    asyncAdd(product, 5, function (sum) {
        asyncProduct(sum, 8, function (result) {
            console.log(result);
        });
    });
});

const step3 = (x, y) => asyncProduct(x, y, function (result) {
    console.log(result);
});

const step2 = (x, y, z) => asyncAdd(x, y, function (sum) {
    step3(sum, z);
});

const step1 = (x, y, z, k) => asyncProduct(x, y, function (product) {
    step2(product, z, k);
});
*/


//sumar asíncronamente [1, 4, 6, 2, 4] //17 implementando

numbers = [1, 4, 6, 2, 4];

function asyncAddArray(xs, cbk){
    if(xs.length == 0){
        cbk(xs);
    } else if(xs.length == 1){
        cbk(xs[0]);
    } else {
        var [head, neck, ...tail] = xs;
    
        asyncAdd(head, neck, function(result){
            tail.push(result);
            asyncAddArray(tail, function(result){
                cbk(result);
            })
        })
    }
}

asyncAddArray(numbers, function(result){
    //console.log(result);
})

// Sumar asíncronamente [1, 2, 3, 4] + [0, -1, 1, 2] ==  [1, 1, 4, 6]; implementando

numbers1 = [1, 2, 3, 4];
numbers2 = [0, -1, 1, 2];

function asyncAddArrays(xs, ys, zs, cbk) {
    if(xs.length == 0 || ys.length == 0){ //por si un array es más grande que el otro
        cbk(zs);
    } else {
        var [xhead, ...xtail] = xs;
        var [yhead, ...ytail] = ys;
        asyncAdd(xhead, yhead, function(result){
            zs.push(result);
            asyncAddArrays(xtail, ytail, zs, function(result){
                cbk(result);
            })
        })
    }   
}

asyncAddArrays(numbers1, numbers2, [], function(result){
    //console.log(result);
})

//Correccion Javier

function asyncAddArrayIter(xs,cbk){
    for(let x of xs){
        cbk = (function (cbk) {
            return function (result) {
                asyncAdd(x, result, cbk)
            }
        })(cbk)
    }
    cbk(0);
}

asyncAddArrayIter(numbers, function(result){
    //console.log(result);
})

//ReduceRight

function asyncReduceRight(xs, f, init, cbk){
    for(let x of xs){
        cbk = (function (cbk) {
            return function (result) {
                f(x, result, cbk)
            }
        })(cbk)
    }
    cbk(init);
}

asyncReduceRight(numbers, asyncProduct, 4, function(result){
    //console.log(result);
})

//Correccion Javier asyncAddArrays

function asyncAddArrays2(xs, ys, cbk){
    const zs = [];
    const max_size = Math.min(xs.length, ys.length);
    let size = 0;
    for(let i = 0; i < max_size; i++){
        asyncAdd(xs[i], ys[i], function(result){
            size++;
            zs[i] = result;
            if(size === max_size){
                cbk(zs);
            }
        })
    }
}

asyncAddArrays2(numbers1, numbers2, function(result){
    //console.log(result);
})

//ZipWith -> juntame dos arrays con una función

function zipWith(xs, ys, f, cbk){
    const zs = [];
    const max_size = Math.min(xs.length, ys.length);
    let size = 0;
    for(let i = 0; i < max_size; i++){
        f(xs[i], ys[i], function(result){
            size++;
            zs[i] = result;
            if(size === max_size){
                cbk(zs);
            }
        })
    }
}

zipWith(numbers1, numbers2, asyncAdd, function(result){
    //console.log(result);
})

zipWith(numbers1, numbers2, asyncProduct, function(result){
    //console.log(result);
})

//asyncMap -> transforma un array;

/*function asynInc(x, cbk){
    setTimeout(function(){
        cbk(x + 1);
    }, Math.floor(Math.random() * 20) + 50);
}*/

function asyncInc(x, cbk){
    asyncAdd(x, 1, cbk);
}

function asyncDouble(x, cbk){
    asyncProduct(x, 2, cbk);
}

function asyncMap(xs, f, cbk){
    const ys = [];
    const max_size = xs.length;
    let size = 0;
    for(let i = 0; i < xs.length; i++){
        f(xs[i], function(result){
            size++;
            ys[i] = result;
            if(size == max_size){
                cbk(ys);
            }            
        });               
    }
}

asyncMap(numbers, asyncInc, function(result){  
    //console.log(result);
});

asyncMap(numbers, asyncDouble, function(result){  
    //console.log(result);
});

//asyncCompose(asyncf, asyncg)

function multicompose(...fs){ //Esto indica que se van a recibir muchas cosas que se almacenarán como un array
    fs = [...fs]; //si el array está vacío cuando te lo pasan no ejecutas nada, devuelves lo que te pasen.
    return function(x, cbk){
        for(var i = fs.length -1; i>=0; i--){
            console.log(x)
            f = fs[i];
            console.log(f)
            f(x, function(result){
                console.log(",,,,,,",result);
                x = result;
                console.log("22222",x);
            });
        }
        return x;
    }
}

function asyncCompose(f, cbk){
    cbk = function(x){
        f(x);
    }
}





console.log(multicompose(asyncInc, asyncInc)(4));

//console.log(asyncCompose((result) => result, asyncInc, asyncDouble)(4));
