/**
 * @author Max Tushev
 * @class Core.fieldtype.float
 * Float number field. Use number field in the form for this data type.
 */
Ext.define('Core.fieldtype.float', {
    extend: 'Core.fieldtype.Field'
    
    ,getValueToSave: function(value, old_value, callback) {
        
        if(value) {
            value = value.replace(',','.').replace(/\s/g,'')
            value = parseFloat(value);
        }
        callback(isNaN(value)? null:value);
    }
})