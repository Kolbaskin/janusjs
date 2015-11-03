var sqlBuilder = require('json-sql');
var mongo = require('mongodb');

/**
 * @author Max Tushev <maximtushev@gmail.com>
 * @class Database.drivers.Oracle.Database
 * @extend: Database.drivers.Mysql.Database
 * The connector to Oracle database
 */
Ext.define("Database.drivers.Oracle.Database", {
    
    extend: 'Database.drivers.Mysql.Database'
    
    /**
     * @cfg {String} tns TNS connection string. (Example: (DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=xe))))
     * @cfg {String} hostname
     * @cfg {Int} port Default: 1521
     * @cfg {String} database
     * @cfg {String} user
     * @cfg {String} password
     */
    
    // private
    ,constructor: function(cfg) {
        var me = this;
        this.connect(cfg) 
        this.callParent()
    }    
    
    ,connect: function(cfg, callback) {
        
        if(!cfg) return;
        
        var me = this
            ,ora = require("oracle")
        
        ora.connect(cfg, function(err, conn) {
            if(err)
                me.error(err)    
            else {
                me.conn = conn
                if(!!callback)
                    callback(conn)
            }
        });
    }

    ,getCollections: function(callback) {
        var me = this;
        me.conn.execute("select table_name,table_type from cat where table_type in ('TABLE','VIEW') and table_name not like 'BIN\$%'", function(err, res) {
            res.each(function(item) {
                return item.TABLE_NAME.toLowerCase()
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
        
        var offset = 0, limit;
        
        if(cfg.limit) {
            limit = cfg.limit;
            delete cfg.limit;
        }
        if(cfg.offset || cfg.offset === 0) {
            offset = cfg.offset;
            delete cfg.offset;
        }
        var res = sqlBuilder(cfg)
    
        out = []
        for(var i in res.values) {
            if(Ext.isBoolean(res.values[i]))
                out.push(res.values[i]? 1:0)
            else
                out.push(res.values[i])    
        }
        res.query = res.query.replace(/\$p/g,':')
        res.values = out
        res.query = res.query.slice(0,-1)
        if(limit) {
            res.query = 'SELECT a.* FROM (SELECT b.*, rownum b_rownum FROM (' + res.query + ') b WHERE rownum <= ' + (offset + limit) + ') a WHERE b_rownum >= ' + offset
        }

//console.log('res:', res)
        
        return res
    }
    
                
    ,createCollection: function(collection, callback) {
        var me = this;
        [
            function(call) {
                me.conn.execute([
                    'CREATE table ":1" (',
                    '"_ID"        NUMBER,',
                    '"MTIME"      NUMBER,',
                    '"CTIME"      NUMBER,',
                    '"REMOVED"    NUMBER,',
                    'constraint  "TEST_PK" primary key ("_ID")'    
                ].join(), [collection], function(e, d) {
                    if(e) 
                        me.error(e)
                    else
                        call()
                })
            }
            ,function(call) {
                me.conn.execute('CREATE sequence ":1"', [collection + '_SEQ'], function(e,d) {
                    if(e) 
                        me.error(e)
                    else
                        call()
                })
            }
            ,function() {
                me.conn.execute([
                    'CREATE trigger ":1"',  
                    '  before insert on ":2"',              
                    '  for each row ',
                    'begin ', 
                    '    select ":3".nextval into :NEW._ID from dual;',
                    'end;'
                ],['BI_' + collection, collection, collection + '_SEQ'], function(e,d) {
                    if(e) 
                        me.error(e)
                    else
                        callback()
                })
            }
        ].runEach()
    }
    
    ,createObjectId: function(collection, cb) {
        cb(new mongo.BSONPure.ObjectID() + '')
    }  
})