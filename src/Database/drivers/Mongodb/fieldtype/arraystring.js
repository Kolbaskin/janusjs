/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.arraystring
 * @extend Database.fieldtype.Field
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
Ext.define('Database.drivers.Mongodb.fieldtype.arraystring', {
    extend: 'Database.drivers.Mongodb.fieldtype.array'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {        
        if(value && Ext.isString(value)) {
            value = value.split('\n')
            if(value.length == 1) value = value[0].split(',')
            for(var i=0;i<value.length;i++) value[i] = value[i].trim()
        } else value = [];
        arguments[1] = value
        this.callParent(arguments)
    }
    
    ,getDisplayValue: function(model, record, name, callback) {
        var value = '';
        if(record && record[name] && !!record[name].join) {
            value = record[name].join(',')
        }
        callback(value)
    }

})