var express = require("Express");
var regex = require("regex");
var spawn = require("child_process").spawn;
var app = express();
var router = express.Router();
var globalVariable = "";
var data = "DefaultValues";
var myregex = new regex('\\a*');

app.use("/router",router);

// ls = spawn('python.exe',['C:\\Users\\chinmay_kulkarni\\Desktop\\mypy1.bat',""]);
// ls.stdout.on("data",function(data){
//     console.log(data.toString("utf8"));
// });
// ls.stderr.on('data', function (data) {
//     console.log('stderr: ' + data);
// });
// ls.on('exit', function (code) {
//     console.log('child process exited with code ' + code);
// });


router.get("/:username",function(req,res){
    data = "modified!";
    var param = JSON.stringify(req.params);
    param  = JSON.parse(param);
    console.log(param);
    res.end("Hello World");
});

app.listen(1234);



