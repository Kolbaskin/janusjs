var //,mysqlUtilities = require('mysql-utilities')
    sqlBuilder = require('json-sql');//require('mongo-sql');

/**
 * @author Max Tushev <maximtushev@gmail.com>
 * @class Database.drivers.Mysql.Database
 * @extend: Drivers.db.Base
 * The connector to MySQL database
 */
Ext.define("Database.drivers.Mysql.Database", {
    
    extend: 'Database.Base'
    
    
    
    /**
     * @cfg {String} host The hostname of the database you are connecting to. (Default: localhost)
     * @cfg {Number} port The port number to connect to. (Default: 3306)
     * @cfg {String} localAddress The source IP address to use for TCP connection. (Optional)
     * @cfg {String} socketPath The path to a unix domain socket to connect to. When used host and port are ignored.
     * @cfg {String} user The MySQL user to authenticate as.
     * @cfg {String} password The password of that MySQL user.
     * @cfg {String} database Name of the database to use for this connection (Optional).
     * @cfg {String} charset The charset for the connection. (Default: 'UTF8_GENERAL_CI')
     * @cfg {String} timezone The timezone used to store local dates. (Default: 'local')
     * @cfg {Number} connectTimeout The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 2 minutes)
     * @cfg {String} stringifyObjects: Stringify objects instead of converting to values. (Default: 'false')
     * @cfg {Boolean} insecureAuth Allow connecting to MySQL instances that ask for the old (insecure) authentication method. (Default: false)
     * @cfg {Boolean} typeCast Determines if column values should be converted to native JavaScript types. (Default: true)
     * @cfg {String} queryFormat A custom query format function. 
     * @cfg {Boolean} supportBigNumbers When dealing with big numbers (BIGINT and DECIMAL columns) in the database, you should enable this option (Default: false).
     * @cfg {Boolean} bigNumberStrings Enabling both supportBigNumbers and bigNumberStrings forces big numbers (BIGINT and DECIMAL columns) to be always returned as JavaScript String objects (Default: false). Enabling supportBigNumbers but leaving bigNumberStrings disabled will return big numbers as String objects only when they cannot be accurately represented with JavaScript Number objects (which happens when they exceed the [-2^53, +2^53] range), otherwise they will be returned as Number objects. This option is ignored if supportBigNumbers is disabled.
     * @cfg {Boolean} dateStrings Force date types (TIMESTAMP, DATETIME, DATE) to be returned as strings rather then inflated into JavaScript Date objects. (Default: false)
     * @cfg {Boolean} debug Prints protocol details to stdout. (Default: false)
     * @cfg {Boolean} trace Generates stack traces on Error to include call site of library entrance ("long stack traces"). Slight performance penalty for most calls. (Default: true)
     * @cfg {Boolean} multipleStatements Allow multiple mysql statements per query. Be careful with this, it exposes you to SQL injection attacks. (Default: false)
     * @cfg {String} flags List of connection flags to use other than the default ones. It is also possible to blacklist default ones. For more information, check Connection Flags.
     * @cfg {Object} ssl 
     * Object with ssl parameters or a string containing name of ssl profile
     * 
     *     @example
     *     {
     *        host: 'localhost',
     *        ssl: {
     *            ca: fs.readFileSync(__dirname + '/mysql-ca.crt')
     *        }
     *     }
     */
    
    // private
    ,constructor: function(cfg) {
        var me = this;
        this.connect(cfg) 
        this.type = 'sql'
        this.name = 'mysql'
        this.callParent()
    }    
    
    ,connect: function(cfg, callback) {
        var me = this
            ,mysql = require("mysql")
        
        me.conn = mysql.createConnection(cfg);
        me.conn.connect(function(err) {
            if(err)
                me.error(err)    
            else 
                if(!!callback)
                    callback(me.conn)
        });
        //mysqlUtilities.upgrade(me.conn);
        //mysqlUtilities.introspection(me.conn);
    }
    
    ,useDatabase: function(database, callback) {
        var me = this;
        me.conn.query('USE ' + database, function(err, res) {
            if(err) 
                me.error(err)
            else
                if(!!callback)
                    callback(me.conn)
        })
        
    }
    
    ,close: function(callback) {
        var me = this;
        me.conn.end(function(err) {
            if(err)
                me.error(err)
            else
                if(!!callback) callback()     
        })
    }
     
    ,getCollections: function(callback) {
        var me = this;
        me.conn.query("SHOW TABLES", function(err, res) {
            res.each(function(item) {
                for(var i in item) {
                    return item[i]    
                }
            },true)            
            callback(res)
        })
    }
    
    ,queryBuild: function(cfg) {
        if(cfg.fields && Ext.isObject(cfg.fields)) {
            var qFields = []
            for(var i in cfg.fields) if(cfg.fields[i] == 1) qFields.push(i)
            cfg.fields = qFields
        }
        
        var res = sqlBuilder(cfg)
    
        out = []
        for(var i in res.values) {
            if(Ext.isBoolean(res.values[i]))
                out.push(res.values[i]? 1:0)
            else
                out.push(res.values[i])    
        }
      
        res.query = res.query.replace(/\$p[0-9]{1,}/g,'?')
        res.values = out
        return res
    }
    
    ,getData: function(collection, find, fields, sort, start, limit, callback) {
        var me = this
            ,fieldsAr = []
            ,cfg = {
                type: 'select',
                table: collection,
                condition: find                
            };
            
        [
            // get counts
            function(call) {
                cfg.fields = ["count(*) as cnt"]
                var res = me.queryBuild(cfg)

//console.log('res:', res)
                
                me.conn.query(res.query, res.values, function(e, data) {
                    if(data && data[0] && data[0].cnt) 
                        call(data[0].cnt)    
                    else
                        callback(0, [])
                })
            }
            
            ,function(total) {
                cfg.fields = fields
                if(sort) cfg.sort = sort
                if(limit) cfg.limit = limit
                if(start || start === 0) cfg.offset = start
                var res = me.queryBuild(cfg)
                
                
                
                me.conn.query(res.query, res.values, function(e, data) {
                    if(data) {
                        callback(total, data)
                    }
                })
            }
        ].runEach();
    }
            
    ,checkCollection: function(model, callback) {
        var me = this;
        if(!model.fields) {
             if(!!callback) callback()
             return false;
        };
        
        [
            function(call) {
                me.getCollections(function(tabs) {
                    call(tabs.indexOf(model.collection)==-1)    
                })
            }
            ,function(crt, call) {
                if(crt) {
                    me.createCollection(model.collection, call)
                } else {
                    call()
                }
            }
            
            ,function(call) {
                me.collection(model.collection).columns(call)    
            }
            
            ,function(cols, call) {
               
                var fnc = function(i) {
                    
                    if(i>=model.fields.length) {
                        call();
                        return;
                    }
                    if(model.fields[i].name != '_id' && !cols[model.fields[i].name]) {
                        if(model.fields[i].type && me.fieldTypes[model.fields[i].type] && !!me.fieldTypes[model.fields[i].type].createField) {
                            me.fieldTypes[model.fields[i].type].createField(model.fields[i], model.collection, me, function(qs) {
                                if(qs) {
                                    me.conn.query(qs, function(e,d) {
                                        //if(e) console.log(e)
                                        fnc(i+1)
                                    })
                                } else
                                    fnc(i+1)
                            })
                        } else {
                            me.fieldTypes.Field.createField(model.fields[i], model.collection, me, function(qs) {
                                if(qs) {
                                    me.conn.query(qs, function(e,d) {
                                        //if(e) console.log(e)
                                        fnc(i+1)
                                    })
                                } else
                                    fnc(i+1)    
                            })
                        }                            
                    } else
                        fnc(i+1)
                }
                fnc(0)
            }
            ,function() {
                if(!!callback) callback()    
            }
        ].runEach();
    }
    
    ,createCollection: function(collection, callback) {

        
        this.conn.query("CREATE TABLE " + collection + " (`_id` int(11) NOT NULL AUTO_INCREMENT, `mtime` int(11) DEFAULT NULL, `ctime` int(11) DEFAULT NULL, `removed` tinyint(1) NOT NULL DEFAULT '0', PRIMARY KEY (`_id`)) ENGINE=InnoDB", function(e, d) {
            callback()    
        })    
    }
})