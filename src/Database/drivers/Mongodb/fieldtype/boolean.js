/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.boolean
 * @extend Database.fieldtype.Field
 * Boolean field. Use checkbox field in the form for this data type.
 */
Ext.define('Database.drivers.Mongodb.fieldtype.boolean', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        callback(!!value)
    }
})