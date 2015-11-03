/**
 * @author Max Tushev
 * @class Core.fieldtype.array
 * Array field
 */
Ext.define('Core.fieldtype.array', {
    extend: 'Core.fieldtype.Field'
    
    ,getValueToSave: function(value, old_value, callback) {        
        if(value) {
            if(!Ext.isArray(value)) value = [value]
        }
        callback(value);
    }
})