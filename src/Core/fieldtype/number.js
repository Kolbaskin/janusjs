/**
 * @author Max Tushev
 * @class Core.fieldtype.number
 * Integer number field. Use number field in the form for this data type.
 */
Ext.define('Core.fieldtype.number', {
    extend: 'Core.fieldtype.Field'
    
    ,getValueToSave: function(value, callback) {
        
        if(value) {
            value = (value+'').replace(/\s/g,'')
            value = parseInt(value);
        }
        callback(isNaN(value)? null:value);
    }
})