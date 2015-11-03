/**
 * @author Max Tushev
 * @class Database.fieldtype.Field
 * @extend: Ext.Base
 * Server
 * 
 * Base class of field type for model classes
 */
Ext.define('Database.fieldtype.Field', {
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
     * @param {Core.data.DataModel} model
     * @param {Object} record
     * @param {String} name
     * @param {Function} callback
     */
    ,getDisplayValue: function(model, record, name, callback) {
        if(record) callback(record[name])
        else callback(null)
    }
    
    /**
     * @method
     * Getting value for saving data
     * @param {Core.data.DataModel} model
     * @param {Mixed} value
     * @param {Object} newRecord
     * @param {Object} oldRecord
     * @param {String} name The field name
     * @param {Function} callback
     */
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {
        callback(value)   
    }
    
    /**
     * @method
     * Convert string to valid value
     * @param {String} value
     * @param {Function} callback
     */
    ,StringToValue: function(value, callback) {
        if(!!callback)
            this.getValueToSave(null, value, null, null, null, callback)
        else
            return this.getValueToSave(null, value)
    }
    
    /**
     * @method
     * Creating a param of this field for filtering
     * @param {Core.data.DataModel} model
     * @param {Object} filter Extjs grid filter element
     * @param {String} name
     * @param {Function} callback
     * 
     */
    ,getFilterValue: function(model, filter, name, callback) {
        var f = {}
        
        if(filter.operator && ['lt','gt','lte','gte','eq'].indexOf(filter.operator) != -1) {
            f[name] = {}
            f[name]['$' + filter.operator] = filter.value 
        } else
            f[name] = filter.value
        
        callback(f)   
    }
    
    ,getDbFieldName: function(field) {
        return field.mapping || field.name;    
    }

})