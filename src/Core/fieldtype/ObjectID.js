/**
 * @author Max Tushev
 * @class Core.fieldtype.ObjectID
 * Mongodb ObjectId field
 */
Ext.define('Core.fieldtype.ObjectID', {
    extend: 'Core.fieldtype.Field'
    
    ,getValueToSave: function(value, callback) {
        callback((value+'')._id())
    }
    
    ,getFilterValue: function(filter, name, callback) {
         var f = {}
         f[name] = filter.value._id()
         callback(f)   
    }
})