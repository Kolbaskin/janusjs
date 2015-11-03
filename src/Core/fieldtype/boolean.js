/**
 * @author Max Tushev
 * @class Core.fieldtype.boolean
 * Boolean field. Use checkbox field in the form for this data type.
 */
Ext.define('Core.fieldtype.boolean', {
    extend: 'Core.fieldtype.Field'
    
    ,getValueToSave: function(value, callback) {
        callback(!!value)
    }
})