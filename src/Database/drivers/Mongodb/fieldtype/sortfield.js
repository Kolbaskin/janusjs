/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.sortfield
 * @extend Database.fieldtype.Field
 * Use this field type in modules with activated a manual reorder function.
 * 
 *     @example
 *     // Model file:
 *     Ext.define('Desktop.modules.mymodule.model.myModuleModel', {    
 *         extend: "Core.data.DataModel",
 *   
 *         fields: [
 *             .....
 *             {
 *                 type: 'sortfield',
 *                 name: 'indx',
 *                 type: 'sortfield',
 *                 sort: 1,
 *                 filterable: true,
 *                 editable: true,
 *                 visible: true
 *             },
 *             .....
 *         ]
 *     })
 *     
 *     // Grid file:
 *     Ext.define('Desktop.modules.mymodule.model.myModuleList', {    
 *         extend: "Core.grid.GridWindow",
 *         sortManually: true,
 *         .....
 *     })
 * 
 */
Ext.define('Database.drivers.Mongodb.fieldtype.sortfield', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {         
        if(value || value === 0) {
            var x = parseInt(value)
            if(!isNaN(x)) {
                callback(x)
                return;
            }
        }
        var me = this
            ,sort = {}
            ,fields = {}
            ,key = name
        sort[key] = -1
        fields[key] = 1
        model.db.collection(model.collection).find({removed:{$ne: true}}, fields).sort(sort).limit(1).toArray(function(e,d) {
            if(d[0] && d[0][key]) {
                callback((parseInt(d[0][key]) + 1))
            } else {
                callback(1)
            }
        })
    }

})