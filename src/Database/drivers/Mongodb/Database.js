/**
 * @author Max Tushev <maximtushev@gmail.com>
 * @class Drivers.db.Mongodb.Database
 * @extend: Drivers.db.Base
 * The connector to Mongodb database
 */

var mongo = require('mongodb')
 
Ext.define("Database.drivers.Mongodb.Database", {
    
    extend: 'Database.Base'

    ,constructor: function(cfg) {
        this.connect(cfg)  
        this.type = 'nosql'
        this.name = 'mongodb'
        
        this.callParent(arguments)
    }    
    
    ,connect: function(cfg, callback) {
        var me = this;
        mongo.MongoClient.connect('mongodb://'+cfg.host+':'+cfg.port+'/'+cfg.db_name, function(e, db) {            
            me.db = db
            require('transactions').init(me.db)
            if(!!callback) callback(db);  
        });
    }
    
    ,useDatabase: function(database, callback) {
    }
    
    ,close: function(callback) {
        this.db.close()
    }
     
    ,getCollections: function(callback) {
        this.db.collectionNames(callback)
    }
    
    ,collection: function(name) {
        return this.db.collection(name)    
    }
    
    ,createObjectId: function(collection, cb) {
        cb(new mongo.BSONPure.ObjectID())
    }    
       
    ,getData: function(collection, find, fields, sort, start, limit, callback) {
        var me = this
        
        var cursor = me.db.collection(collection).find(find, fields)
        cursor.count(function(e, cnt) {         
            if(cnt && cnt>0) {
                cursor.sort(sort).limit(limit).skip(start).toArray(function(e,data) {
                    callback(cnt, data)
                })
            } else {
                callback(0, [])
            }
        })
    }
    
})