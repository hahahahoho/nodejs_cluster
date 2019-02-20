let cluster = require('cluster');
let cpu_num = require('os').cpus().length;
let a = function(){
    console.log('read');
}

if(cluster.isMaster){
    console.log('master');
    cluster.fork();
    cluster.fork();
    cluster.on('exit', function(worker, code, signal){
        console.log('worker' + worker.process.pid + 'died');
    })
}else if(cluster.worker.id==1){
    console.log(cluster.worker.id)
    for(let i = 0 ; i<5; i++){
        (function(i){
            setTimeout(a, 1000*i);
        }(i))
    }
}else{
    console.log(cluster.worker.id)
    console.log('write');
}

