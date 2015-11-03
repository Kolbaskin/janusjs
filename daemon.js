var fs = require("fs");
var daemon = require('daemon');

var cld = daemon.daemon("cluster", [], {
    stdout: fs.openSync('./log.stdout', 'a+'),
    stderr: fs.openSync('./log.stderr', 'a+')
});


