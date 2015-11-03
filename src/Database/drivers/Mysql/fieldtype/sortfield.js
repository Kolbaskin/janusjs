/**
 * @author Max Tushev
 * @class Database.drivers.Mysql.fieldtype.sortfield
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
Ext.define('Database.drivers.Mysql.fieldtype.sortfield', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {         
        if(value) {
            if(value == 'auto') {
                callback(null)
                return;
            }
            var x = parseInt(value)
            if(!isNaN(x) && x) {
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
        
        model.db.collection(model.collection).query({
            type: 'select',
            condition: {removed:{$ne: true}},
            fields: fields,
            sort: sort,
            limit: 1
        }, function(e,d) {     
            if(d[0] && d[0][key]) {
                callback((parseInt(d[0][key]) + 1))
            } else {
                callback(1)
            }
        })
    }
    
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " INT NULL DEFAULT NULL");
    }

})