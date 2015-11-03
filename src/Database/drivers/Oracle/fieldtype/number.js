/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.number
 * @extend Database.fieldtype.Field
 * Integer number field. Use number field in the form for this data type.
 */
Ext.define('Database.drivers.Oracle.fieldtype.number', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        
        if(value) {
            value = (value+'').replace(/\s/g,'')
            value = parseInt(value);
        }
        callback(isNaN(value)? null:value);
    }
    ,getFilterValue: function(model, filter, name, callback) {
        var f = {}
        var val = parseInt(filter.value)
        
        if(isNaN(val)) {
            callback(null)
            return;
        }
        
        if(filter.operator && ['lt','gt','lte','gte','eq'].indexOf(filter.operator) != -1) {
            f[name] = {}
            f[name]['$' + filter.operator] = val
        } else
            f[name] = val
        
        callback(f)   
    }
    
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " NUMBER NULL DEFAULT NULL");
    }
})