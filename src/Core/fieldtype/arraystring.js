/**
 * @author Max Tushev
 * @class Core.fieldtype.arraystring
 * Array to string field
 * 
 *     @example
 *     // Model file:
 *     Ext.define('Desctop.mymodule.model.myModuleModel', {
 *         extend: 'Core.data.DataModel',
 *         
 *         collection: 'mycollection',
 *         fields: [
 *         .....
 *         {
 *             type: 'arraystring',
 *             name: 'param1'
 *         }
 *         .....
 *         ]
 *     })
 * 
 *     // View file:
 *     Ext.define('Desctop.mymodule.view.myModuleForm', {
 *         extend: 'Core.form.DetailForm',
 * 
 *         buildItems: function() {
 *             return [
 *                 .....
 *                 {
 *                     xtype: 'textfield',
 *                     name: 'param1'
 *                 },
 *                 .....
 *             ]
 *         }
 *     })
 *         
 */
Ext.define('Core.fieldtype.arraystring', {
    extend: 'Core.fieldtype.Field'
    
    ,getValueToSave: function(value, old_value, callback) {        
        if(value) {
            value = value.split('\n')
            if(value.length == 1) value = value[0].split(',')
            for(var i=0;i<value.length;i++) value[i] = value[i].trim()
        }
        callback(value)
    }
    
    ,getDisplayValue: function(name, record, callback) {
        var value = '';
        if(record && record[name] && !!record[name].join) {
            value = record[name].join(',')
        }
        callback(value)
    }

})