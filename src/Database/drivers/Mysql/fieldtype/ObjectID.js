/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.ObjectID
 * @extend Database.fieldtype.Field
 * Mongodb ObjectId field
 */
Ext.define('Database.drivers.Mysql.fieldtype.ObjectID', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        var v = parseInt(value)
        if(isNaN(v)) v = null
        if(!!callback)
            callback(v)
        else
            return v
    }
    
    ,getFilterValue: function(model, filter, name, callback) {
         var f = {}
         f[name] = parseInt(filter.value)
         if(isNaN(f[name])) f[name] = 0
         callback(f)   
    }
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " int NULL DEFAULT NULL, ADD INDEX (" + field.name + ")");
    }
    
})