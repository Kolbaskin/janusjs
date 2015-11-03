/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.float
 * @extend Database.fieldtype.Field
 * Float number field. Use number field in the form for this data type.
 */
Ext.define('Database.drivers.Mongodb.fieldtype.float', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        
        if(value && Ext.isString(value)) {
            value = value.replace(',','.').replace(/\s/g,'')
            value = parseFloat(value);
        }
        callback(isNaN(value)? null:value);
    }
    
    ,getFilterValue: function(model, filter, name, callback) {
        var f = {}
        var val = parseFloat(filter.value)
        
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
})