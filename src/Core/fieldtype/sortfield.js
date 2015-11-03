/**
 * @author Max Tushev
 * @class Core.fieldtype.sortfield
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
Ext.define('Core.fieldtype.sortfield', {
    extend: 'Core.fieldtype.Field'
    
    ,getValueToSave: function(value, callback) {        
        if(value) {
            var x = parseInt(value)
            if(!isNaN(x) && x) {
                callback(x)
                return;
            }
        }
        var me = this
            ,sort = {}
            ,fields = {}
            ,key = me.fieldName
        sort[key] = -1
        fields[key] = 1
        me.src.db.collection(me.collection).find({removed:{$ne: true}}, fields).sort(sort).limit(1).toArray(function(e,d) {
            if(d[0] && d[0][key]) {
                callback((parseInt(d[0][key]) + 1))
            } else {
                callback(1)
            }
        })
    }

})