var ncp = require("ncp")
    ,readline = require('readline')
    ,rmdir = require('rimraf')
    ,fs = require('fs')
    ,mongo = require('mongodb')
    ,memcache = require('memcache')
    ,crypto = require('crypto');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var port = 8008
    ,projectsDir = 'projects'
    ,rootuser = 'admin'
    ,rootuserpass = 'admin'
    ,projectDir = 'crm'
    ,serverName = 'localhost'
    ,nameSpace = 'Crm'

var config = {
    MONGO: {
        db_name: 'yode_example',
        port: 27017,
        host: 'localhost',
        user: '',
        pass: ''
    },
    MEMCACHE: {
        host: 'localhost',
        port: 11211
    }    
}

var steps = [ 
    

    // Step 1
    /*
    function(callback) {
        ncp(__dirname + "/node_modules", __dirname + "/../../node_modules", function (err) {
            rmdir(__dirname + "/node_modules", function(error){
                callback(true)
            });            
        });
    },
    */
    
    function(callback) {
        rl.question("The directory for projects [" + projectsDir + "]: ", function(answer) {
            if(answer != '') projectsDir = answer     
            callback(true)          
        })    
    },
    
    function(callback) {    
        rl.question("First project directory name [" + projectDir + "]: ", function(answer) {
            if(answer != '') {
                projectDir = answer
            }
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("First project server name [" + serverName + "]: ", function(answer) {
            if(answer != '') {
                serverName = answer
            }
            callback(true)          
        })       
    },
    
    
    function(callback) {    
        rl.question("First project server port [" + port + "]: ", function(answer) {
            if(answer != '') {
                var p = parseInt(answer)
                if(!isNaN(p)) port = p
            }
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("First project namespace [" + nameSpace + "]: ", function(answer) {
            if(answer != '') {
                nameSpace = answer
            }
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Name for superuser [" + rootuser + "]: ", function(answer) {
            if(answer != '') {
                rootuser = answer
            }
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Password of superuser [" + rootuserpass + "]: ", function(answer) {
            if(answer != '') {
                rootuserpass = answer                
            }
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Mongodb host [" + config.MONGO.host + "]: ", function(answer) {
            if(answer != '') config.MONGO.host = answer     
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Mongodb port [" + config.MONGO.port + "]: ", function(answer) {
            if(answer != '') config.MONGO.port = parseInt(answer)     
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Mongodb user [" + config.MONGO.user + "]: ", function(answer) {
            if(answer != '') config.MONGO.user = answer     
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Mongodb password [" + config.MONGO.pass + "]: ", function(answer) {
            if(answer != '') config.MONGO.pass = answer     
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Mongodb database name for first project [" + config.MONGO.db_name + "]: ", function(answer) {
            if(answer != '') config.MONGO.db_name = answer     
            callback(true)          
        })       
    },
    
    // Test mongo connect
    function(callback) {
        var usr = ""
        if(config.MONGO.user) {
            usr = config.MONGO.user + ':' + config.MONGO.pass + '@'    
        }
        mongo.MongoClient.connect('mongodb://' + usr + config.MONGO.host + ':' + config.MONGO.port + '/' + config.MONGO.db_name, function(e, db) {        
             if(e) {
                 console.log('Trying mongo connect: ERROR!')
                 callback(false)   
             } else {
                 console.log('Trying mongo connect: OK')
                 
                 var dump = require('./defaultdb')
                 
                 rootuserpass = crypto.createHash('sha1').update(rootuserpass).digest('hex')
                 
                 dump.dump(db, rootuser, rootuserpass)
                 callback(true)
                 
                 
             }
        });    
    },
    
    function(callback) {    
        rl.question("Memcache host [" + config.MEMCACHE.host + "]: ", function(answer) {
            if(answer != '') config.MEMCACHE.host = answer     
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Memcache port [" + config.MEMCACHE.port + "]: ", function(answer) {
            if(answer != '') config.MEMCACHE.port = parseInt(answer)     
            callback(true)          
        })       
    },
    
    function(callback) {    
        var mem = new memcache.Client(config.MEMCACHE.port, config.MEMCACHE.host);      
        
        mem.connect();  
        try {
        mem.set('test', 'test',  function(e, rr){
            if(e) {
                console.log('Trying memcached connect: ERROR!')
                callback(false)   
             } else {
                console.log('Trying memcached connect: OK')
                callback(true)
             }
        }, 1)
        } catch(e) {
            console.log('Trying memcached connect: ERROR!')
            callback(false) 
        }
    },

    
    
    function(callback) {
        
        console.log('__dirname:', __dirname)
        
        fs.readFile(__dirname + "/server.js", {encoding: 'UTF-8'},function(e, data) {
if(e) console.log('e214:', e)            
            var dir = '', d = __dirname.split('/')
            
            for(var i=1;i<d.length-2;i++) dir += '/' + d[i]

            data = data.replace("{port}", port)
            data = data.replace("{projectsDir}", projectsDir)
            data = data.replace("{projectDir}", projectDir)
            data = data.replace("{serverName}", serverName)
            data = data.replace("{nameSpace}", nameSpace)
            fs.writeFile(__dirname + "/../../server.js", data, function(e) { 
if(e) console.log('e225:', e) 
                callback(true)
            })
        })
    },
    
    function(callback) {
        fs.rename(__dirname + "/daemon.js", __dirname + "/../../daemon.js", function(e) {
if(e) console.log('e233:', e)  
            callback(true)
        })
    },
    function(callback) {
        fs.rename(__dirname + "/cluster.js", __dirname + "/../../cluster.js", function(e) {
if(e) console.log('e239:', e)  
            callback(true)
        })
    },
    function(callback) {
        fs.rename(__dirname + "/cluster.config.js", __dirname + "/../../cluster.config.js", function(e) {
if(e) console.log('e245:', e)  
            callback(true)
        })
    },
    
    
        
    function(callback) {
        fs.mkdir(__dirname + "/../../" + projectsDir, function(e) {
if(e) console.log('e254:', e)    

            ncp(__dirname + "/emptyproject", __dirname + "/../../" + projectsDir + '/' + projectDir, function (err) {

if(err) {
    console.log('err:', err)    
}

                var fn = __dirname + "/../../" + projectsDir + '/' + projectDir + '/config.json'
                
                fs.mkdir(__dirname + "/../../" + projectsDir + '/' + projectDir + '/tmp', function() {
                    
                
                    fs.mkdir(__dirname + "/tmp", function() {
                        fs.readFile(fn, 'utf8', function(e,d) {
                            if(d) {
                                d = d.replace("{nameSpace}", nameSpace)
                                d = d.replace("{MONGO.port}", config.MONGO.port)
                                d = d.replace("{MONGO.host}", config.MONGO.host)
                                d = d.replace("{MONGO.user}", config.MONGO.user)
                                d = d.replace("{MONGO.pass}", config.MONGO.pass)
                                d = d.replace("{MONGO.db_name}", config.MONGO.db_name)
                                
                                d = d.replace("{MEMCACHE.port}", config.MEMCACHE.port)
                                d = d.replace("{MEMCACHE.host}", config.MEMCACHE.host)
                                
                                fs.writeFile(fn, d, 'utf8', function() {
                                    callback(true)    
                                })  
                            } else {
                                console.log(fn)
                                console.log(e)
                                callback(true)     
                            }
                        })
                    })
                })
                
            });    
        })
    }
    
    
]

var runs = function(i) {
    if(i == steps.length) {
        
        console.log('Installation completed successfully!')
        
        console.log('Type "node server" to run an example project')
        //require('../../server')
        
        rl.close();
        process.exit(0);
        return;
    }
    steps[i](function(log) {
        if(log) runs(i+1)
        else {
            "not ok";
            process.exit(1);
        }
    })
}

runs(0)
/*
fs.exists(__dirname + '/../../server.js', function(log) {
    if(log) {
        require('../../server')
    } else {
        
    }
})
*/


