var fs = require('fs')

/**
 * @author Max Tushev
 * @class Database.drivers.Oracle.fieldtype.image
 * @extend Database.drivers.Mysql.fieldtype.image
 * Image field. Use image field in the form for this data type.
 * 
 *     @example
 *     // Detail Form 
 *     Ext.define('Desctop.mymodule.view.myModuleForm', {
 *         extend: 'Core.form.DetailForm',
 *         
 *         requires: ['Desktop.core.widgets.ImageField'],
 * 
 *         buildItems: function() {
 *             return [
 *                 .....
 *                 {
 *                     xtype: 'image',
 *                     name: 'img',
 *                     tumbSizes: '250x150x500x', // sizes of preview and full image
 *                     width: 350,
 *                     height: 150        
 *                 },
 *                 .....
 *             ]
 *         }
 *     })
 */
Ext.define('Database.drivers.Oracle.fieldtype.image', {
    extend: 'Database.drivers.Mysql.fieldtype.image'
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " VARCHAR2(500) NULL DEFAULT NULL");
    }
})