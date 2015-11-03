/**
 * @author Max Tushev
 * @class Core.fieldtype.Field
 * Server
 * 
 * Base class of field type for model classes
 */
Ext.define('Core.fieldtype.Field', {
    extend: 'Ext.Base'
    
    ,constructor: function() {             
        if(arguments[0]) {
            for(var i in arguments[0]) {
                this[i] = arguments[0][i]    
            }
        }
    }
    
    /**
     * @method
     * Getting value for display
     * @param {String} name
     * @param {Object} record
     * @param {Function} callback
     */
    ,getDisplayValue: function(name, record, callback) {
        if(record) callback(record[name])
        else callback(null)
    }
    
    /**
     * @method
     * Getting value for saving data
     * @param {Mixed} value
     * @param {Function} callback
     */
    ,getValueToSave: function(value, callback) {
        callback(value)   
    }
    
    /**
     * @method
     * Creating a param of this field for filtering
     * @param {Object} filter Extjs grid filter element
     * @param {String} name
     * @param {Function} callback
     * 
     */
    ,getFilterValue: function(filter, name, callback) {
        var f = {}
        f[name] = filter.value
        callback(f)   
    }
})