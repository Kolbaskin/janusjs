/**
 * @author Max Tushev <maximtushev@gmail.com>
 * @class Drivers.db.Mysql.Collection
 * @extend: Drivers.db.Collection
 * The connector to MySQL database, Collection class
 */
Ext.define("Drivers.db.Mongodb.Collection", {
    extend: 'Drivers.db.Collection'
    
    
    ,insert: function(data, callback) {
        var me = this;
        me.db.conn.insert(me.collection, data, function(err, result) {
            callback(err, result)
        })
    }
    
    ,update: function(where, data, callback) {
        var me = this;
        me.db.conn.update(me.collection, data, where, function(err, result) {
            callback(err, result)
        })
    }
    
    ,find: function(where, fields, callback) {
        var me = this
            ,qFields = []
        for(var i in fields) if(fields[i] == 1) qFields.push(i)    
        me.db.conn.select(me.collection, (qFields.length? qFields.join(','):'*'), where, function(err, result) {
            callback(err, result)
        })
    }
    
    ,findOne: function(where, fields, callback) {
        var me = this
        me.find(where, fields, function(err, result) {
            if(result && result[0])
                callback(null, result[0])
            else
                callback(null, {})
        })    
    }
    
})