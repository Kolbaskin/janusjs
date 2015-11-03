/**
 * @author Max Tushev
 * @class Core.fieldtype.string
 * String field.
 */
Ext.define('Core.fieldtype.string', {
    extend: 'Core.fieldtype.Field' 
    
    ,getFilterValue: function(filter, name, callback) {
        var f = {}
        f[name] = new RegExp(filter.value, 'i')
        callback(f)   
    }
})