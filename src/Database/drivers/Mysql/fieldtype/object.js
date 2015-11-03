/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.string
 * @extend Database.fieldtype.Field
 * String field.
 */
Ext.define('Database.drivers.Mysql.fieldtype.object', {
    extend: 'Database.drivers.Mysql.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        try {
            value = JSON.stringify(value)
        } catch(e) {value = ''}
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
    
    ,getDisplayValue: function(model, record, name, callback) {        
        var value = ''
        try {
            value = JSON.parse(record[name])
        } catch(e) {value = ''}
        callback(value)
    }
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " MEDIUMTEXT NULL DEFAULT NULL");
    }
})