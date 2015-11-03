/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.number
 * @extend Database.fieldtype.Field
 * Integer number field. Use number field in the form for this data type.
 */
Ext.define('Database.drivers.Mysql.fieldtype.number', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        
        if(value) {
            value = (value+'').replace(/\s/g,'')
            value = parseInt(value);
        }
        callback(isNaN(value)? null:value);
    }
    
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " INT NULL DEFAULT NULL");
    }
})