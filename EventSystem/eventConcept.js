var events = require("events");

var eventemitter = new events.EventEmitter();

function Function1(){
    console.log("Im in function 1");    
}
function Function2(){
    console.log("Im in function 1.1"); 
}


eventemitter.on([Function1(),Function2()],function(){
    //console.log("Im in function 1!");
});

eventemitter.emit("");






