/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.string
 * @extend Database.fieldtype.Field
 * String field.
 */
Ext.define('Database.drivers.Mysql.fieldtype.array', {
    extend: 'Database.drivers.Mysql.fieldtype.object'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        if(!Ext.isArray(value)) value = [value]
        try {
            value = JSON.stringify(value)
        } catch(e) {value = ''}
        callback(value)   
    }
    
})