timer = setInterval(function(){
    console.log(">>>")
}, 1000);

setTimeout(function(){
    clearInterval(timer);
})

function asyncAdd(cbk){
    setTimeout(function(){
        cbk ((x) => x);
    })
}

asyncAdd(function(result){
    console.log(result(4));
})