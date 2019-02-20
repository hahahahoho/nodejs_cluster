# NodeJS - Cluster(클러스터)

이번 시간은 클러스터에 대해서 알고자하여 작성하였습니다. 

 작성하게 된 이유는....! 이전 시간에서 크롤링을 통해서 데이터를 가져오는 방법에 대해서 설명하였습니다. 이 때, 저는 서버를 동작 시킬 때 단일 쓰레드가 아니라 멀티 쓰레드를 통해서 작업을 분할하면 더 빠르게 작업을 할 수 있지 않을까? 라는 생각을 해보았습니다. 

그래서 멀티 쓰레드를 구성(음.. 여기서는 2개만)하여 하나의 쓰레드는 오직 read의 작업만하고 하나의 쓰레드는 read된 데이터를 일정 간격으로 확인하여 DB에 write하는 작업을 하도록 구현하려고 합니다.

우선 클러스터란 무엇일까요??

#### 클러스터란 클러스터링 기술을 웹 서버에 도입한 것으로, 여러 대의 독립된 컴퓨터를 묶어서 하나의 시스템처럼 동작하게 하는 것이라고 합니다.

정의가 너무 어렵습니다. 그리고 지금 사용하는 nodejs에서의 cluster모듈의 개념과 조금 다릅니다. 우리는 nodejs에서의 cluster모듈은 쓰레드를 추가하여 cpu의 프로세서를 추가적으로 사용하는 개념으로 이해하시면 쉽다고 생각이 듭니다. 

엄밀히 따지고, 심화과정으로 가게되면 분명히 이슈가 발생하고 정확한 정의에 대해서 찾겠지만 지금은 가볍게 들어가는 마음으로 작성하겠습니다.

코드는 매우 간단합니다.

```
let cluster = require('cluster'); //모듈 호출
let cpu_num = require('os').cpus().length; //나의 cpu 쓰레드 길이
let a = function(){
    console.log('read');
}

if(cluster.isMaster){ //마스터 클러스터는 초기 한번 실행됨. 이후 worker클러스터 실행
    console.log('master'); //즉 총 3번 이 페이지가 실행된다라고 생각하시면 됩니다.
    cluster.fork(); //클러스터 생성
    cluster.fork(); //클러스터 생성
    cluster.on('exit', function(worker, code, signal){ //클러스터 종료시 호출
        console.log('worker' + worker.process.pid + 'died');
    })
}else if(cluster.worker.id==1){ //클러스터 아이디값으로 판별
    console.log(cluster.worker.id)
    for(let i = 0 ; i<5; i++){ //read작업
        (function(i){
            setTimeout(a, 1000*i);
        }(i))
    }
}else{
    console.log(cluster.worker.id) 
    console.log('write'); //write작업
}
```

간단하게 구성만 해보았고 본격적으로 내부코드는 작성해야 할 듯 합니다.

작성하고 실행하면서 발생하는 이슈들에 대해서는 업데이트를 통해서 말씀드리도록 하겠습니다.

감사합니다.