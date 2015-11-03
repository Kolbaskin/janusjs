var winston = require('winston')
    ,cluster = require('cluster')
    ,workers = []
    ,stopLog = false
    ,config = require(process.argv[2]? process.argv[2]:"./cluster.config.js").params
    ,clusterConfig = {
        exec: config.server        
    }

if(config.process_name) process.title = config.process_name

if(config.logs_file) {
    winston.add(winston.transports.File, { filename: config.logs_file});
    clusterConfig.silent = true
}

cluster.setupMaster(clusterConfig)

var workAround = function(worker) {
    var listeners = null;
    
    listeners = worker.process.listeners('exit')[0];
    var exit = listeners[Object.keys(listeners)[0]];
    
    listeners = worker.process.listeners('disconnect')[0];
    var disconnect = listeners[Object.keys(listeners)[0]];
    
    worker.process.removeListener('exit', exit);
    worker.process.once('exit', function(exitCode, signalCode) {
        if (worker.state != 'disconnected')
            disconnect();
        exit(exitCode, signalCode);
    });
}

var startWorker = function() {
    var w = cluster.fork()
    w.on('message', function(data) {
        if(data.action && actions[data.action]) actions[data.action]();
    })
    if(config.logs_file) {        
        w.process.stdout.on('data', function(chunk) {
            winston.info(chunk.toString());            
        });
        w.process.stderr.on('data', function(chunk) {
            winston.warn(chunk.toString());
        });       
    }
    workAround(w);
    return w
}

var actions = {
    restart: function() {
        stopLog = true
        var stopWorker = function(i) {
            if(!workers[i]) {
                stopLog = false
                return;
            }
            workers[i].kill()
            workers[i] = startWorker()        
            setTimeout(function() {stopWorker(i+1)}, 500);
        }
        stopWorker(0)
    }
}

for (var i = 0; i < config.num_workers; i++) {    
    workers[i] = startWorker();
}

var startChecker = function() {
    setTimeout(function() {
        if(!stopLog) {
            for(var i=0;i<workers.length;i++) {
                if(workers[i].process._channel === null) {
                    workers[i] = cluster.fork();
                }
            }
        }
        startChecker()
    }, config.checker_timeout)
}
 
startChecker()