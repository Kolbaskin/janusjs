var querystring = require('querystring')
    ,formidable = require('formidable')
    ,util = require('util')
    ,fs = require('fs')
    ,streamBuffer = require("stream-buffers")
    ,staticsrv = require('node-static')
    ,memcache = require('memcache')
    ,BSON = require('bson').pure().BSON
    ,mimeTypes = require("../../conf/mime_types.json");
    
syncServerTime = null;
    
    
/**
 * @class Core.ProjectServer
 * @author Max Tushev
 * One project server class
 * This is server-side component
 * 
 * You can make self server for each project. Place this file into your project:
 * /myprojectdir/protected/Core/ProjectServer.js
 * 
 *     @example
 *     Ext.define("MyProjectNamespace.Core.ProjectServer",{
 *         extend: "Core.ProjectServer",
 *                 
 *         route: function(request, response, params) {
 *             response.end('Hello world!') 
 *         }
 *     })
 * 
 * Use this opportunity if you need to use different database or any more unstandard resources in your project.
 * 
 */
Ext.define("Core.ProjectServer",{
    extend: "Ext.Base"
            
    ,wsRecommectTimeout: 10000
     
    
    /**
     * @cfg {Number} maxUploadSize
     * Max upload file size (Bt)
     */        
    
    /**
     * @cfg {Number} maxPostSize
     * Max post data size (Bt)
     */ 
    
    /**
     * @cfg {String} hashtype
     * Hash algorithm type (default: sha1)
     */ 
    
    /**
     * @cfg {String} adminCoreModulesDir
     * Admin modules dir name (default: static/admin/modules)
     */
    
    /**
     * @cfg formConfig
     * Form configure
     * @cfg formConfig.encoding (default: utf-8)
     * @cfg formConfig.uploadDir (default: ./tmp)
     * @cfg formConfig.maxFieldsSize (default: 1Mb)
     */
    
    /**
     * @cfg {Array} routes
     * Routes rules config
     * {path: regExp, method: 'this.methodname'}
     */
    
    ,constructor: function(cfg) {             
        
        var me = this;
        
        me.AbstractModel = null
        
        me.sources = {
            db: {},
            wsConnections: {} 
        }
        
        me.config = {
            maxUploadSize: 52428800, // 50Mb
            maxPostSize: 2097152, // 2Mb
            hashtype: 'sha1',
            adminCoreModulesDir: __dirname + "/../../static/admin/modules",
            formConfig: {
                encoding: "utf-8",
                uploadDir: "./tmp",
                maxFieldsSize: 1024*1024
                //,maxFields:
            },
            routes: [{
                path: /^\/[a-z0-9]{1,}\.[a-z0-9\.^\/]{1,}\//i,
                method: "apiRoute"
            }]
        }
        
        //Ext.apply(me.config, cfg)
        
        if(arguments[0]) {
            for(var i in arguments[0]) {
                if(i == 'routes') {
                    arguments[0][i].each(function(r) {
                        if(Ext.isString(r.path)) r.path = new RegExp(r.path, 'i')
                        me.config[i].push(r)
                    })
                } else 
                    me.config[i] = arguments[0][i]    
            }
        } 
        
        me.startStaticServer() 
        me.readModelsListeners()

    }
    
    /**
     * @method
     * Starting server for static contents
     */
    ,startStaticServer: function() {            
        if(this.config.staticDir) {
            this.UserStaticServer = new(staticsrv.Server)(this.config.staticDir, {
                serverInfo: "x-server", 
                cache: 36000, 
                gzip: true,
                prepareFile: this.prepareStaticFile
            })
        }
    }
    
    /**
     * @method
     * Initialisation server resources: memcached, database, mail transport
     * @param {Function} callback called when all resources are initialized
     */
    ,init: function(callback) {
        var me = this;
        
        me.startCrontab();
        
        [
            function(call) {
                if(me.config.mail) 
                    me.sources.mailTransport = Ext.create('Core.Mailtransport', {
                        type: me.config.mail.type,
                        server: me.config.mail.server
                    })//nodemailer.createTransport(me.config.mail.type, me.config.mail.server);
                call();
            }
            ,function(call) {
                if(me.config.memcache) {
                    me.sources.mem = new memcache.Client(me.config.memcache.port, me.config.memcache.host);      
                    me.sources.mem.connect();
                }
                call()
            }
            ,function(call) {
                if(me.config.elasticsearch) {
                    var elasticsearch = require('elasticsearch');
                    me.sources.elasticsearch = new elasticsearch.Client(me.config.elasticsearch);  
                }
                call()
            }
            ,function(call) {        
                me.dbConnect(function() {
                    call()
                })
            }
            ,function() {
                me.AbstractModel = Ext.create('Core.AbstractModel', {
                    src: me.sources,
                    config: me.config
                })
                if(!!callback) callback()
            }
        ].runEach();
        
        me.startWsClient();
        
        setInterval(function() {
            me.cleanLongDataArray();
        }, 10000)
        
    }
    
    /**
     * @method
     * Connection to MongoDb
     * @param {Function} callback 
     */
    ,dbConnect: function(callback) {
        this.sources.db = Ext.create("Database.drivers.Mongodb.Database", this.config.mongo);
        callback()
    }
    
    /**
     * @method
     * Alias of {@link Core.ProjectServer.getInputData}
     */
    ,listener: function(req, res, globalStaticServer) {
        var me = this;
        
        [
            function(call) {
                me.UserStaticServer.serve(req, res, function(e, r) {
                    if (e || !r) call()
                    else {
                        var type = me.checkMimeHeader(req.url)
                        if(type) r.headers['Content-type'] = type;
                    }
                })
            }
            ,function(call) {
                globalStaticServer.serve(req, res, function(e, r) {
                    if (e || !r) call()
                    else {
                        var type = me.checkMimeHeader(req.url)
                        if(type) r.headers['Content-type'] = type;
                    }
                })
            }
            ,function() {
                me.getInputData(req, res)  
            }
        ].runEach()
    }
    
    ,checkMimeHeader: function(url) {
        for(var i in mimeTypes) {
            if(url.substr(url.length - i.length) == i) {
                return mimeTypes[i]
            }
        }
        return;
    }
    
    /**
     * @method
     * Parse request data
     * @param {Object} request
     * @param {Object} response
     */
    ,getInputData: function(req, res) {
        var me = this
            ,params = {};
        params.gpc = querystring.parse(req.url.split('?')[1])
        
        if (req.method == 'POST') {  

    
            if(req.headers['content-type'] && req.headers['content-type'].substr(0,19) == 'multipart/form-data') {
            // Multipart form-data post    
                me.multipartFormData(req, res, params)    
            } else {
                if(req.headers['yode-action'] && req.headers['yode-action'] == 'upload') 
                    me.readUploadPost(req, res, params)
                else
                    me.readRegularPost(req, res, params)
                
            }
        } else {            
            me.getCookieData(req, res, params);        
        } 
    }
    
    ,readUploadPost: function(req, res, params) {
        var me = this
            ,tmpName = Math.random()
            ,tmpPath = __dirname + '/../../static/tmp/' + tmpName
            ,len = 0
            ,fullData = fs.createWriteStream(tmpPath);
                
        req.on('data', function(chunk) {            
            if(len > me.config.maxUploadSize) {
                res.writeHead(500, "Internal Server Error", {'Content-Type': 'text/plain'});
                res.end('Too lage data!');                   
            } else {
                len += chunk.length;
                fullData.write(chunk)
            }
        });   
        
        req.on('end', function() {
            params.tmpName = tmpName;
            me.getCookieData(req, res, params);            
        }); 
    }
    
    ,readRegularPost: function(req, res, params) {
        var me = this
            ,fullBody = ''
            ,fullData = new streamBuffer.WritableStreamBuffer();               
                
        req.on('data', function(chunk) {            
            if(fullData.length > me.config.maxUploadSize) {
                res.writeHead(500, "Internal Server Error", {'Content-Type': 'text/plain'});
                res.end('Too lage data!');                   
            } else {
                fullBody += chunk.toString();
                fullData.write(chunk)
            }
        });   
        
        req.on('end', function() {
            params.gpc = Ext.merge(params.gpc, querystring.parse(fullBody))
            params.fullData = fullData.getContents()
            me.getCookieData(req, res, params);            
        }); 
    }
    
    /**
     * @method
     * Getting data from multipart form request
     * @param {Object} request
     * @param {Object} response
     * @param {Object} params get, post and cookie data as one object as key -> val
     */
    ,multipartFormData: function(req, res, params) {
        var me = this
            ,form = new formidable.IncomingForm()
            ,files = {}
            ,fields = {gpc: {}}
            ,fileSize = 0 
            ,postSize = 0
    
        for(var i in me.config.formConfig) {
            form[i] = me.config.formConfig[i]
        }
        form.on('file', function(field, file) {
            fileSize += file.size
            if(fileSize > me.config.maxUploadSize) {
                return false;
            }
            if(files[field]) {
                if(!util.isArray(files[field])) files[field] = [files[field]]                    
                files[field].push(file)        
            } else {
                files[field] = file;
            }
        })            
        form.on('field', function(field, value) {
            postSize += value.length;
            if(postSize > me.config.maxPostSize) {
                return false;
            }
            if(fields.gpc[field]) {
                if(!util.isArray(fields.gpc[field])) fields.gpc[field] = [fields.gpc[field]]                    
                fields.gpc[field].push(value)        
            } else {
                fields.gpc[field] = value;
            }
        })            
        form.on('end', function() {
            fields.files = files
            var params = querystring.parse(req.url.split('?')[1])
            for(var i in params) {
                fields.gpc[i] = params[i]
            }
            me.getCookieData(req, res, fields); 
        });
        form.parse(req);
    }
    
    /**
     * @method
     * Getting cookies data from request object.
     * @param {Object} request
     * @param {Object} response
     * @param {Object} params get, post and cookie data as one object as key -> val
     */
    ,getCookieData: function(req, res, params) {
        params.cookies = {}
        req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=')
                ,key = parts[0].trim()
                ,val = decodeURIComponent((parts[1] || '').trim());
            params.cookies[key] = val;
            if(params.gpc[key] === undefined) params.gpc[key] = val
        });
        //params.gpc = Ext.merge(params.gpc, params.cookies)
        this.prepGPCData(req, res, params)
        
    }
    
    /**
     * @method
     * Parse jsonData param from string into JSON.
     * @param {Object} request
     * @param {Object} response
     * @param {Object} params get, post and cookie data as one object as key -> val
     */
    ,prepGPCData: function(req, res, params) {
        if(params.gpc && params.gpc.jsonData) {
            var v;
            try {
                v = JSON.parse(params.gpc.jsonData)
            } catch(e) {}
            if(v) params.gpc.jsonData = v;
        }
        var x;
        for(var i in params.gpc) {
            if(/[\[\]]/.test(i)) {
                x = /^([a-z0-9\-^\[]{1,})\[([a-z0-9^\]]{0,})\]/.exec(i)
                if(x && x[1] && x[2] !== undefined) {
                    if(x[2]) {
                        if(params.gpc[x[1]] == undefined) params.gpc[x[1]] = {}
                        params.gpc[x[1]][x[2]] = params.gpc[i]
                    } else {
                        if(params.gpc[x[1]] == undefined) params.gpc[x[1]] = []
                        params.gpc[x[1]].push(params.gpc[i])
                    }
                    delete params.gpc[i];
                }
            }
        }
        
        this.route(req, res, params)
    }
    
    /**
     * @method
     * Routing request url to an action
     * @param {Object} request
     * @param {Object} response
     * @param {Object} params get, post and cookie
     */
    ,route: function(req, res, params) {
        var me = this;
        
        for(var i = 0;i<me.config.routes.length;i++) {
            if(new RegExp(me.config.routes[i].path).test(req.url)) {
                me[me.config.routes[i].method](req, res, params)
                return;
            }
        }
        me.defaultRoute(req, res, params)
    }
    
    /**
     * @method
     * Checking is file exists by object name
     * @param {String} name of object
     * @param {Function} callback 
     */
    ,isExistsModule: function(name, callback) {
        var parts = name.split('.')
            ,path = Ext.Loader.getPath(parts[0])
            
        if(path) {
            for(var i=1;i<parts.length;i++) {
                if(/^[0-9a-z\_]{1,}$/i.test(parts[i])) {
                    path += '/' + parts[i]  
                } else {
                    callback(false)
                    return;
                }
            }
            fs.exists(path + '.js', function(res) {
                if(!res && path.indexOf('/protected/') != -1) {
                    fs.exists(path.replace('/protected/', '/static/admin/') + '.js', function(res) {
                        callback(res)
                    })
                } else              
                    callback(res)    
            })
        } else
            callback(false)
    }
    
    /**
     * @method
     * Controller creates and launches the appropriate method
     * @param {Object} request
     * @param {Object} response
     * @param {Object} params 
     */
    ,apiRoute: function(req, res, params) {
        var me = this
            ,path = req.url.split('/')[1].split('.')
            ,controllerName = path[0]
        for(var i=1;i<path.length-1;i++) {
            controllerName += '.' + path[i]
        }
        
        me.isExistsModule(controllerName, function(log) {
            if(log) {
                me.runRouteModel(controllerName, req, res, params, path)
            } else {
               me.defaultRoute(req, res, params)
            }
        })
    }
    
    ,runRouteModel: function(controllerName, req, res, params, path) {
        var me = this, mdl, method;
        [
            function(next) {
                mdl = Ext.create(controllerName, {
                    request: req, 
                    response: res, 
                    params: params,
                    src: me.sources,
                    config: me.config
                })
                next()
            }
            ,function(next) {
                mdl.checkAuthorization(params.gpc, function(auth) {
                    next(auth)
                })    
            }
            ,function(uid, next) {
                if(uid) 
                    mdl.user = {id: uid}
                method = path[path.length-1]
                if(!!mdl.run) mdl.run(method)
                else
                if(!!mdl['$' + method]) {                   
                    mdl['$' + method](params.gpc, function(result) {next(result)})
                }
            }
            ,function(result, next) {
                if(result) {
                    if(me.modelListeners[controllerName]) {
                        me.modelListeners[controllerName].prepEach(
                            function(item, nxt) {
                                if(item.listeners[method]) {
                                    var cls = Ext.create(item.model, {scope: mdl})
                                    cls[item.listeners[method]](result, function() {
                                        nxt(item)    
                                    })
                                    cls.destroy();
                                } else
                                    nxt(item)
                                
                            },
                            function(arr) {
                                next(result)
                            }
                        )
                    }
                } else {                    
                    mdl.destroy();
                    next(result)
                }
            }
            ,function(result) {
                if(result) {                
                    
                    var out = {headers: {'Content-Type': 'text/plain;utf-8'}}
                    if(Ext.isObject(result)) {
                        out.headers['Content-Type'] = 'application/json;utf-8'
                        result = JSON.stringify({response: result})
                    } else
                        result += ''
                   
                    out.headers['Content-Length'] = Buffer.byteLength(result, 'utf8')
                    res.writeHead(200, 'OK', out.headers); 
                    res.end(result)
                }
                mdl.destroy();    
            }
        ].runEach()    
    }
    
    /**
     * @method
     * Default controller creates and launches the "run" method
     * @param {Object} request
     * @param {Object} response
     * @param {Object} params 
     */
    ,defaultRoute: function(req, res, params) {
        var me = this;


        Ext.create('Core.DefaultController', {
            request: req, 
            response: res, 
            params: params,
            src: me.sources,
            config: me.config
        }).run()    
                         
    } 
    
    ,startCrontab: function() {
        var me = this;

        if(me.config.crontab && me.config.crontab.length) {        
        
            var commands = [], x, o;
            me.config.crontab.each(function(item) {
                x = item.split(' ');
                o = {time: [], command: []}
                for(var j = 0;j<x.length;j++) {
                    if(x[j]) {
                        if(o.time.length<5) o.time.push(x[j])
                        else {
                            x[j] = x[j].split('.');
                            o.method = x[j].splice(-1,1);
                            o.model = x[j].join('.')
                            break;
                        }
                    }
                }
                commands.push(o)
            })
            
            if(commands.length) {
                setInterval(function() {
                    var d        = new Date()
                        ,min     = d.getMinutes()
                        ,hour    = d.getHours()
                        ,day     = d.getDate()
                        ,month   = d.getMonth()
                        ,weekDay = d.getDay()
                        ,log
                    commands.each(function(command) {
                        log = true;
                       
                        if(command.time[0] != '*' && command.time[0] != min) log = false;
                        if(command.time[1] != '*' && command.time[1] != hour) log = false;
                        if(command.time[2] != '*' && command.time[2] != day) log = false;
                        if(command.time[3] != '*' && command.time[3] != month) log = false;
                        if(command.time[4] != '*' && command.time[4] != weekDay) log = false;
                        if(log) {
                            Ext.create(command.model, {
                                src: me.sources,
                                config: me.config
                            })[command.method]()
                        }                    
                    })               
                }, 60000)
            }
        }
        
    }
    
    /**
     * @method
     * Listen http input data and selected websocket requests 
     * @param {Object} request 
     */
     ,wsListener: function(request) {
        var me = this;
        [
            function(call) {
                me.wsInitConnection(request, function(conn) {
                    
                    if(conn)
                        call(conn)
                })
            }
            ,function(conn, call) {
                conn.on('message', function(message) {
                    me.wsOnMessage(conn, message);
                });
                conn.on('close', function(reasonCode, description) {
                    me.wsOnClose(conn, reasonCode, description);
                });
            }
            
        ].runEach()
     }
     
     /**
      * @method
      * Initialisation new connection by websocket
      * @param {Object} request
      * @param {Function} callback
      */
     ,wsInitConnection: function(request, callback) {
        var me = this
            ,params = request.resourceURL.query
            ,isServer = !!params.isServer;
        
           
        [
            function(call) {
                if(params && params.login && params.pass) {
                    me.AbstractModel.callModel('Admin.model.User.getAutorization', {
                        collection: 'admin_users', 
                        find: {login: params.login}, 
                        password: params.pass
                    }, function(user) {
                        call(user.user)
                    })
                } else
                    call(null)
            }
            
            ,function(user, call) {
                if(user) {
                    call(user._id, user.superuser) 
                    return;
                }
                me.AbstractModel.checkAuthorization(params, function(id) {
                    if(id) { 
                        call(id, false)
                    } else
                        callback(null)
                })
            }
            
            ,function(id, isSuperuser, call) {
                if(isSuperuser) {
                    call(id, isSuperuser, {})    
                } else {
                    me.AbstractModel.callModel('Admin.model.User.getUserInfo', {auth: id}, function(user) {
                        if(user) {
                            if(user.superuser)
                                call(id, true, {})
                            else
                                call(id, false, user.group.modelAccess)
                        } else {
                            callback(null)   
                        }
                    })    
                }                
            }
            
            ,function(id, isSuperuser, permis, call) {
                var conn;
                try {
                    conn = request.accept('yode-protocol', request.origin);
                } catch(e) {}
                if(conn) {
                    call(id, isSuperuser, permis, conn)
                }
                else
                    callback(null)
            }
            ,function(id, isSuperuser, permis, conn, call) { 
                conn.userId = id
                conn.isServer = isServer;
                if(!me.sources.wsConnections[id]) me.sources.wsConnections[id] = {sUser: isSuperuser, permis: permis, conns: []}
                me.sources.wsConnections[id].conns.push(conn)
                
                me.setUserOnline(id)
                
                call(conn)
            }
            ,function(conn) {
                me.runCheckAuth(conn, request.resourceURL.query)
                callback(conn)
            }
        ].runEach()    
    }
    
    /**
     * @method
     * Checking authorisation when client connect by websocket
     * @param {Websocket.conn} conn
     * @param {Object} params get, post and cookie
     */ 
    ,runCheckAuth: function(conn, params) {
        var me = this;
        setTimeout(function() {
            if(conn) {
                if(conn.state === 'closed')
                    delete conn;
                else     
                    me.AbstractModel.checkAuthorization(params, function(id) {
                        if(id) 
                            me.runCheckAuth(conn, params)
                    })   
            } 
        }, 60000)
        
    }
    
    /**
     * @method
     * Calls when the message received in the websocket
     * @param {Websocket.conn} conn
     * @param {String} message
     */
    ,wsOnMessage: function(conn, message) {
        var me = this
            ,data;
        if (message.type === 'binary') {
            try {
                data = BSON.deserialize(message.binaryData);
            } catch(e) {}
            me.prepareWsData(conn, data)
        } else {            
            
            if(message.utf8Data.substr(0,5) == 'frame') {
                data = me.readLongData(message.utf8Data)    
            } else {
                data = message.utf8Data
            }
            if(data) {
                try {
                    data = JSON.parse(data)    
                } catch(e) {}
                me.prepareWsData(conn, data)
            }
        }
    }
    
    ,readLongData: function(data) {
        var i = 6
            ,n = 0
            ,s = ''
            ,token = ''
            ,act = data.substr(5,1);
        
        while(i<data.length && data.charAt(i) != ':') s += data.charAt(i++)
        n = parseInt(s)
        if(isNaN(n)) return;
        i++;
        s = '';
        while(i<data.length && n) {token += data.charAt(i++);n--;}
        while(i<data.length && data.charAt(i) != ':') s += data.charAt(i++)        
        n = parseInt(s)
        if(isNaN(n)) return;
        i++;
        if(!this.longDataArray) this.longDataArray = {}
        if(!this.longDataArray[token]) this.longDataArray[token] = {t:(new Date()).getTime(),d:[]}
        this.longDataArray[token].d[n] = data.substr(i)
        
        if(act == 'e') {
            s = this.longDataArray[token].d.join('')
            delete this.longDataArray[token];
            return s;
        }
        return null;
    }
    
    ,cleanLongDataArray: function() {
        if(!this.longDataArray) return;
        var t = (new Date()).getTime();
        for(var i in this.longDataArray) {
            if((t - this.longDataArray[i].t)>30000)
                delete this.longDataArray[i];
        }
    }
    
    ,prepareWsData: function(conn, data) {
        var me = this;
        if(data && data.data && data.data.scope && conn.callbacks) {
            for(var i = 0;i<conn.callbacks.length;i++) {
                if(conn.callbacks[i].scope == data.data.scope) {
                    conn.callbacks[i].cb(data.data)
                    conn.callbacks.splice(i, 1)
                    return;
                }
            }
        } 
        
        if(data && data.data && data.data.model && data.data.action) {
            var model = Ext.create(data.data.model, {
                    src: me.sources,
                    user: {id: conn.userId},
                    config: me.config
                })
            if(!!model.initOnServer) model.initOnServer()            
            
            if(model && model['$' + data.data.action]) {
                model['$' + data.data.action](data.data, function(res) {
                    if(res !== null) {
                        res.scope = data.data.scope;
                        if(data.opid)
                            res.opid = data.opid
                        conn.sendUTF(JSON.stringify({event: data.event, data: res}))
                    }
                    model.destroy();
                }, conn)    
            } else model.destroy();
        } else {
            me.onWsData(conn, data);    
        }
    }
    
    ,wsOnBinary: function(conn, message) {
        if(message.binaryData) {
            var tmpFile = (new Date()).getTime() + Math.random()
                        
        }
    }
    
    /**
     * @method
     * Calls when the client closing websocket connection
     * @param {Websocket.conn} conn
     * @param {Number} reasonCode
     * @param {String} description
     */
    ,wsOnClose: function(conn, reasonCode, description) {
        var me = this;
        for(var i in me.sources.wsConnections) {
            for(var j=0;j<me.sources.wsConnections[i].conns.length;j++) {
                if(me.sources.wsConnections[i].conns[j].state === 'closed') {
                    me.sources.wsConnections[i].conns.splice(j,1);
                    if(!me.sources.wsConnections[i].conns.length) {
                        delete me.sources.wsConnections[i];
                        me.setUserOffline(i)
                    }
                    break;
                }
            }
        }
        delete conn;
    }  
    
    
    ///// WS CLIENT
    
    
    ,startWsClient: function() {
        var me  = this;
        if(!me.config.authoriz) return;
        var WebSocketClient = require('websocket').client;
        
        var wsClient = new WebSocketClient({
            tlsOptions: {
                rejectUnauthorized: false  
            }
        });
        wsClient.on('connectFailed', function(error) {
            console.log("Connect Failed");
            me.WsReconnect()
        });
        
        wsClient.on('connect', function(connection) {
            connection.on('error', function(error) {
                console.log("Connection Error: " + error.toString());
            });
            connection.on('close', function() {
                console.log('Client socket close')
                me.WsReconnect()
            });
            connection.on('message', function(message) {
               me.wsOnMessage(connection, message)
            });
            connection.isServer = true;
            me.sources.db.fieldTypes.ObjectID.getValueToSave(me, me.config.authoriz.key, null, null, null, function(_id) {
                connection.userId = _id
                if(!me.sources.wsConnections[me.config.authoriz.key]) me.sources.wsConnections[me.config.authoriz.key] = {conns:[]}
                me.sources.wsConnections[me.config.authoriz.key].sUser = true
                me.sources.wsConnections[me.config.authoriz.key].permis = {}
                me.sources.wsConnections[me.config.authoriz.key].conns.push(connection)
            })
            
            me.dbSynchronization(connection)
            
        });
        var connStr = 'wss://' + me.config.authoriz.host + '/?isServer=1&login=' + me.config.authoriz.user + '&pass=' + me.config.authoriz.pass;
        wsClient.connect(connStr, 'yode-protocol');
    }
    
    ,WsReconnect: function() {
        var me = this;
        
        syncServerTime = null; // Global time
        
        setTimeout(function() {
            me.startWsClient()
        }, me.wsRecommectTimeout)
    }
    
    ,onWsData: function(conn, data) {
        if(data && data.data && data.event && data.model) {
            var me = this
                ,model = Ext.create(data.model, {
                    src: me.sources,
                    user: {id: conn.userId},
                    config: me.config
                })
            if(!!model.initOnServer) model.initOnServer()            
            if(model && model['wsEvent_' + data.event]) {
                model['wsEvent_' + data.event](conn, data.data, function(res) {
                    model.destroy();
                })    
            } else model.destroy();
        }
    }
    
    ,dbSynchronization: function(conn) {
        var me = this
            ,data = {
                data: {
                    model: 'Core.data.Synchronization',
                    action: 'getTime'
                }
            };
        setTimeout(function() {
            conn.sendUTF(JSON.stringify(data))
        }, 1000)
    }
    
    ,changeUserState: function(_id, state) {
        var me = this
            ,model = Ext.create('Desktop.modules.users.model.UsersModel', {
                src: me.sources,
                config: me.config
            })
        if(!!model.initOnServer) model.initOnServer()            
        model.changeUserState(_id, state, function(res) {
            model.destroy();
        })    
    }
    
    ,setUserOnline: function(_id) {
        this.changeUserState(_id, 1);   
    }
    
    ,setUserOffline: function(_id) {
        this.changeUserState(_id, 0);
    }
    
    ,readModelsListeners: function() {
        var me = this
            ,modulesDir = me.config.adminModulesDir.split('/').pop()
            ,dir = me.config.staticDir + me.config.adminModulesDir;
        
        me.modelListeners = {}
        
        var prepModel = function(module, model, cb) {
            var clsName = me.config.nameSpace + '.' + modulesDir + '.' + module + '.model.' + model.split('.')[0]
                ,cls = Ext.create(clsName, {skipInit: true})
            
            if(cls && cls.listeners) {
                for(var i in cls.listeners) {
                    if(!me.modelListeners[i]) me.modelListeners[i] = [] 
                    me.modelListeners[i].push({model: clsName, listeners: Ext.clone(cls.listeners[i])})
                }
            }
            delete cls;           
            cb()
        }
        
        var prepModuleDir = function(path, cb) {
            fs.readdir(dir + '/' + path + '/model', function(e, files) {                    
                if(files && files.length) files.prepEach(function(file, next) {
                     prepModel(path, file, next)   
                }, function() {cb()})            
            })
        }
        
        fs.readdir(dir, function(e, files) {                    
            if(files && files.length) files.prepEach(prepModuleDir, function() {
                //console.log( me.modelListeners)    
            })            
        })
    }
})