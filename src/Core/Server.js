_LOCALES = {}

var fs = require("fs")
    ,http = require("http")
    ,https = require("https")
    ,staticsrv = require('node-static')
    ,WebSocketServer = require('websocket').server;



Ext.log = function(err) {
    console.log('Server:', err)    
}

/**
 * @author Max Tushev
 * @class Core.Server
 * Main server class
 */
Ext.define("Core.Server",{
    extend: "Ext.Base"
    
    ,projects: []
    ,listenPorts: []
    

    ,constructor: function() {        
        if(arguments[0]) {
            this.createProjects(arguments[0])    
        }
        var statDir = arguments[0].staticDir || 'static'
        
        if(arguments[0].globalNameSpaces) {
            for(var i in arguments[0].globalNameSpaces)
                Ext.Loader.setPath(i, arguments[0].globalNameSpaces[i])
        }
        this.StaticServer = new(staticsrv.Server)(__dirname + '/../../' + statDir, {serverInfo: "x-server", cache: 36000})
    }
    
    /**
     * @method
     * Creating projects servers from config list
     * @private
     * @param {Object} config
     */
    ,createProjects: function(config) {
        var me = this;
        if(!config.defaults) config.defaults = {}
        config.projects.each(function(project) {
            me.createProject(project, config.defaults)
        })
    }
    
    /**
     * @method
     * Creat project subserver
     * @private
     * @param {Object} prjConfig custom configuration params
     * @param {Object} defaults default configuration params
     */
    ,createProject: function(prjConfig, defaults) {
        var me = this;
        
        var err = function(param) {
            console.log('error:', param)
            //Ext.log({
            //    level: 'error',
            //    msg: 'Not specifed param (' + param + ')'
            //}); 
        }
        
        for(var i in defaults) {
            if(!prjConfig[i])  prjConfig[i] = defaults[i]  
        }
        
        if(!prjConfig.module) err('module')
        else if(!prjConfig.nameSpace) err('nameSpace')
        else if(!prjConfig.port) err('port')
        else if(!prjConfig.staticDir) err('staticDir')
        else if(!prjConfig.protectedDir) err('protectedDir')
        else {

            var prjDir = prjConfig.module + '/' + prjConfig.protectedDir        
            Ext.Loader.setPath(prjConfig.nameSpace, prjDir)
            me.projects.push(prjConfig)
            
            for(var i=0;i<me.listenPorts.length;i++) {
                if(me.listenPorts[i].port == prjConfig.port) {
                    break;    
                }
            }
            
            if(i == me.listenPorts.length) {
                me.listenPorts.push({port: prjConfig.port, ssl: prjConfig.ssl})
            }
        }

    }
    
    /**
     * @method
     * Starting to serve all projects
     * @public
     */
    ,serve: function(cb) {
        var me = this
            ,i = 0;        
        var func = function() {
            if(i >= me.projects.length) {
                me.startHttp(cb)
                return;
            }
            me.initProject(me.projects[i], function() {
                i++;
                func();
            })
        }        
        func();
    }
    
    
    /**
     * @method
     * Project initialisation
     * @private
     * @param {Core.ProjectServer} project
     * @param {Function} callback
     */
    ,initProject: function(project, callback) {
        var pServerName = 'Core.ProjectServer' 
            ,path = Ext.Loader.getPath(project.nameSpace)
            ,conf = {}
        if(fs.existsSync(path + '/Core/ProjectServer.js')) {
            pServerName = project.nameSpace + '.Core.ProjectServer'           
        }
        if(fs.existsSync(path + '/../config.json')) {
            conf = require(path + '/../config.json')          
        }
        
        conf.projectDir = path + '/..'
        conf.staticDir = path + '/../' + (conf.staticDir || project.staticDir)
        project.server = Ext.create(pServerName, conf)
        console.log('Server ' + project.serverName + ' is listening port ' + project.port);
        project.server.init(callback)
    }
    
    /**
     * @method
     * Starting http-server
     * @private
     */
    ,startHttp: function(cb) {
        var me = this, i = 0;
        
        var func = function() {
            if(i>=me.listenPorts.length) {
                if(!!cb) cb()
                return;
            }
            func1(me.listenPorts[i])
        }
        var func1 = function(port) {
            if(port.ssl) {
                var opt = {
                    key: fs.readFileSync(port.ssl.key, 'utf8'),
                    cert: fs.readFileSync(port.ssl.cert, 'utf8')
                }
                var server = https.createServer(opt, function(req, res) {
                    me.requestListener(req, res)
                })
            } else {
                var server = http.createServer(function(req, res) {
                    me.requestListener(req, res)
                })
            }
            
            server.listen(port.port)
            
            var wsServer = new WebSocketServer({
                httpServer: server,
                autoAcceptConnections: false
            });
            wsServer.on('request', function(request) {
                me.wsRequestListener(request)
            });
            
            i++;
            func()
        }
        func()
    }
    
    /**
     * @method
     * HTTP requests processing
     * @private
     * @param {Object} req - request object
     * @param {Object} res - response object
     */
    ,requestListener: function(req, res) {          
        var me = this
        if (req && req.headers && req.headers.host) {                 
            var host = req.headers.host.split(":")[0]                
            
            for(var i=0;i<me.projects.length;i++) {
                if(me.projects[i].aliases && me.projects[i].aliases.indexOf(host) != -1) {
                    res.writeHead(301, 'Moved Permanently', {Location: 'http://'+me.projects[i].serverName});
                    res.end()
                    return;
                }

                if(me.projects[i].serverName == host) {
                    me.projects[i].server.listener(req, res, this.StaticServer)
                    return;
                }
            }    
        }       
    }
    
    /**
     * @method
     * Websocket requests processing
     * @private
     * @param {Object} request
     */
    ,wsRequestListener: function(request) {
        var me = this
            ,host = request.host.split(':')[0]
        for(var i=0;i<me.projects.length;i++) {
            if(me.projects[i].serverName == host) {
                me.projects[i].server.wsListener(request)
                break;
            }
        }
    }    
})

if(!!global.gc) {
    setInterval(function() {
        global.gc()
    }, 3000)
}
