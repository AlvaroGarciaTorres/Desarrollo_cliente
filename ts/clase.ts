function map<A, B>(xs: A[], f: (x:A) => B): B[] {
    var ys: B[] = [];
    for(var i=0; i<xs.length; i++){
        ys.push(f(xs[i]));
    }
    return ys;
}

function filter<A>(xs:A[], f:(x: A) => boolean): A[]{
    var ys: A[] = [];
    for(var i=0; i<xs.length; i++){
        if(f(xs[i])){
            ys.push(xs[i]);
        }       
    }
    return ys
}

var xs: number[] = [1, 2, 3, 4];

map(xs, x => x + 1);

map(xs, x => String(x));

map(xs, x => x>=18);

map([1, "ddd"], x => String(x));