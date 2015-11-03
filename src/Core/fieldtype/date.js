/**
 * @author Max Tushev
 * @class Core.fieldtype.date
 * Date field. Use date field in the form for this data type.
 */
Ext.define('Core.fieldtype.date', {
    extend: 'Core.fieldtype.Field'
    
    ,getValueToSave: function(value, callback) {
        callback(new Date(value))
    }
})