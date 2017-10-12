var scribble = require("scribbletune");

try {
    var myclip = scribble.clip({
        notes: ["c#2"],
        pattern: "xxxxx__".repeat(3)
    });

    var myclip2 = scribble.clip({
        notes: ["c#4"],
        pattern: "xxxxx__".repeat(3)
    });

    scribble.midi(myclip.concat(myclip2));
}
catch (err) {
    console.log(err);
}