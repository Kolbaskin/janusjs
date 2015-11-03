/**
 * @author Max Tushev
 * @class Database.drivers.Oracle.fieldtype.sortfield
 * @extend Database.drivers.Mysql.fieldtype.sortfield
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
Ext.define('Database.drivers.Oracle.fieldtype.sortfield', {
    extend: 'Database.drivers.Mysql.fieldtype.sortfield'

    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " NUMBER NULL DEFAULT NULL");
    }

})