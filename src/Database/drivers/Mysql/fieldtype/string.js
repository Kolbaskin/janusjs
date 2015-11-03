/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.string
 * @extend Database.fieldtype.Field
 * String field.
 */
Ext.define('Database.drivers.Mysql.fieldtype.string', {
    extend: 'Database.drivers.Mysql.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        if(value === undefined) value = null
        callback(value)   
    }
    
    ,getFilterValue: function(model, filter, name, callback) {
         var f = {}
         if(filter && filter.operator) {
             switch(filter.operator) {
                case 'like': f[name] = {$like: filter.value.replace(/\*/g, '%')}    
             }
         }         
         callback(f)   
    }
})