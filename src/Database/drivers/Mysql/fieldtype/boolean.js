/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.string
 * @extend Database.fieldtype.Field
 * String field.
 */
Ext.define('Database.drivers.Mysql.fieldtype.boolean', {
    extend: 'Database.drivers.Mysql.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {        
        callback(value? 1:(value === 0? 0: null))  
    }
            
    ,getDisplayValue: function(model, record, name, callback) {        
        callback(record[name] === 1? true: false)
    }
    
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " tinyint DEFAULT 0");
    }
})