/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.date
 * @extend Database.fieldtype.Field
 * Date field. Use date field in the form for this data type.
 */
Ext.define('Database.drivers.Oracle.fieldtype.timestump', {
    extend: 'Database.fieldtype.date'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        callback(new Date(Ext.Date.format((new Date(value)),'m/d/Y')).getTime())
    }
    

    ,getDisplayValue: function(model, record, name, callback) {        
        callback(new Date(record[name]))
    }
    
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " NUMBER NULL DEFAULT NULL");
    }
})